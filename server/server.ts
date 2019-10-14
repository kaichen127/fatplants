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
  res.send("backend working{");
})

app.get('/test1',function (req,res) {
  console.log("get!");
  res.sendFile(__dirname+"/package.json");
  // res.send("backend working");
  //res.send(req.getParameter('test')+" back");
})
app.post('/test',(req,res)=>{
  var fasta = req.body.fasta;
  var method = req.body.method;
  var Ethreshold = req.body.Ethreshold;
  var ProteinDatabase = req.body.ProteinDatabase;
  var maxhit = req.body.maxhit;
  var NucleotideDatabase = req.body.NucleotideDatabase;
  console.log(method);
  //let input = fs.writeFile('input.faa',fasta.toString(),{flag:'w'});
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
    var file={"result":txt.toString()}
    res.send(JSON.stringify(file))
    // res.status(200).send(stdout);
  });
 });
 app.get('/test',function (req,res) {
  console.log(req.query.q);
  res.sendFile(__dirname+"/viewer.html");
  //res.sendFile(__dirname+"/viewer.html?"+req.query.q+".pdb");
})
// console.log("hello");
// var cp=require("child_process");
// cp.exec('blastp -query ~/cow.small.faa -db ~/human.1.protein.faa -out cow_vs_human_blast_results.txt', function(error, stdout, stderr){
//   if(error) {
//     console.error('error: ' + error);
//     return;
//   }
//   console.log('stdout: ' + stdout);
//   console.log('stderr: ' + typeof stderr);
//   let fs = require("fs")
//   let txt = fs.readFileSync('cow_vs_human_blast_results.txt','utf8');
//   console.log(txt.toString())
// });

