const express = require('express');
const childp = require('child_process');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extend:false}));
app.use(bodyParser.json());

const csvNodeDescriptions = './fileCyt/string_protein_annotations.csv'

const csvProteinPathways = './fileCyt/Ara_fatty_acid_protein_pathway_DAVID_For_PPI.txt'

const csvFilePath='./fileCyt/protein-interactions.csv';

// const csvEntityTableFilePath = './fileCyt/GO_AllLists.csv'
const csv=require('csvtojson');

app.listen(4201,'127.0.0.1',function () {
  console.log("listen")
})

app.get('/',(req,res)=>{
  res.send("backend working");
})

app.get('/pdb',(req,res)=>{
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");  
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  console.log(req.query.id);
  //res.send("backend working");
  res.sendFile(__dirname+"/"+req.query.id+".pdb")
})

app.get('/test1',function (req,res) {
  console.log("get!");
})
app.post('/test',(req,res)=>{
  var fasta = req.body.fasta;
  var method = req.body.method.toString();
  var Ethreshold = req.body.Ethreshold;
  var ProteinDatabase = req.body.ProteinDatabase;
  var maxhit = req.body.maxhit;
  var NucleotideDatabase = req.body.NucleotideDatabase;
  console.log(method);
  fs.writeFile('input.faa',fasta.toString(),{
    encoding:'utf8',
    mode:438,
    flag:'w'
},function(err){

})
//如果需要使用自己的数据库，把-db后面的换成需要的数据库就好，数据库需要跟server.ts在一个目录下面，目前写死的是blastp和human.1.protein.faa
//childp.exec(method+' -query ./input.faa -db ./human.1.protein.faa -out results.txt', function(error, stdout, stderr){
  childp.exec('blastp -query ./input.faa -db ./human.1.protein.faa -out results.txt', function(error, stdout, stderr){
    if(error) {
      console.error('error: ' + error);
	    res.status(200).send(error);
      return;
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + typeof stderr);
    let txt = fs.readFileSync('results.txt','utf8');
    // var file={"result":txt.toString()}
    // res.send(JSON.stringify(file))
    res.send(txt)
  });
 });

 app.post('/oneclick',(req,res)=>{
  var fasta = req.body.fasta;
  fs.writeFile('input.faa',fasta.toString(),{
    encoding:'utf8',
    mode:438,
    flag:'w'
},function(err){

})
  childp.exec('blastp -query ./input.faa -db ./human.1.protein.faa -out results.txt', function(error, stdout, stderr){
    if(error) {
      console.error('error: ' + error);
	    res.status(200).send(error);
      return;
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + typeof stderr);
    let txt = fs.readFileSync('results.txt','utf8');
    res.send(txt)
  });
 });

 app.get('/viewer',function (req,res) {
  console.log(req.query.q);
  res.sendFile(__dirname+"/viewer.html");
  //res.sendFile(__dirname+"/viewer.html?"+req.query.q+".pdb");
});

app.get('/data',  function (req, res, next) {
  let requestedPathway = req.query.pathway;
  var pathwayArray;
  console.log(requestedPathway)

  var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(csvProteinPathways)
  });
      
  lineReader.on('line', function (line) {
      // console.log('Line from file:', line);
      if(line.includes(requestedPathway)){
          // console.log(line)
          pathwayArray = line.split(',')
          pathwayArray = pathwayArray.filter(function (el) {
              return el != '';
          });
      }
  });


      csv().fromFile(csvFilePath)
      .then((jsonObj)=>{
          var elements=[];
          var genes=[];
          var groupNum = 1;
          var nodeCount = 0
          //number of object
          for (var i=0;i<jsonObj.length;i++){

              if(jsonObj[i].combined_score < .952){
                  continue;
              }

              if(groupNum > 11){
                  groupNum = 1;
              }

              let node1 = jsonObj[i].node1;
              let node2 = jsonObj[i].node2;
              if(!node1){
                  continue;
              }
              else if(!node2){
                  continue;
              }

              if(!pathwayArray.includes(node1)){
                  continue;
              }
              else if(!pathwayArray.includes(node2)){
                  continue;
              }

              // if node not already mapped
              if(!genes.includes(node1)){
                  genes.push(node1)

                  // node a
                  var data = {};
                  var nodeModel= {};
                  data["id"] = node1;
                  data["name"] = node1;
                  data["score"] = 0;
                  data["gene"] = true;
                  nodeModel["data"] =data;
                  nodeModel["group"] = "nodes"
                  elements.push(nodeModel);
                  nodeCount++

              }

              // if node not already mapped
              if(!genes.includes(node2)){
                  genes.push(node2)

                  //node b
                  var data = {};
                  var nodeModel= {};
                  data["id"] = node2;
                  data["name"] = node2;
                  data["score"] = 0;
                  data["gene"] = true;
                  nodeModel["data"] =data;
                  nodeModel["group"] = "nodes"
                  elements.push(nodeModel);
                  nodeCount++
              }

              for(var j=0; j<elements.length;j++){
                  var tempModel = elements[j]
                  if(tempModel["data"]["name"] == node2){
                      tempModel["data"]["score"] += .0004;
                  }
                  else if(tempModel["data"]["name"] == node1){
                      tempModel["data"]["score"] += .0004;
                  }
              }

              // edge
              var data ={};
              var nodeModel= {};
              data["source"]=node1;
              data["target"]=node2;
              data["weight"]=jsonObj[i].combined_score / 1.2;
              data["group"]= groupNum.toString();
              nodeModel["data"] =data;
              nodeModel["group"] = "edges"
              elements.push(nodeModel);

              groupNum++;
          }
          
          let repsonse = [elements, pathwayArray]
          
          res.send(repsonse);

      })
});

app.get('/node-description', function(req,res,next){

  csv().fromFile(csvNodeDescriptions)
      .then((jsonObj)=>{
          res.send(jsonObj);
      });
});


