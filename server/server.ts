const express = require('express');
const childp = require('child_process');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extend:false}));
app.use(bodyParser.json());

app.listen(4201,'127.0.0.1',function () {
  console.log("listen")
})
app.get('/',(req,res)=>{
  res.send("backend working");
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
})


