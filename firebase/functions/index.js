const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const childp = require('child_process');
const exec = require('child-process-promise').exec;
const fs = require('fs');
const bodyParser = require('body-parser');
const csv = require('csvtojson');
const http = require("http");
const request = require('request');

const csvNodeDescriptions = './fileCyt/string_protein_annotations.csv'
const csvFilePath = './fileCyt/protein-interactions.csv';
const csvProteinPathways = './fileCyt/Ara_fatty_acid_protein_pathway_DAVID_For_PPI.txt'
const csvNodeDescriptions1 = './fileCyt/GO_info.csv'
const csvFilePath1 = './fileCyt/network.csv';
const csvEntityTableFilePath = './fileCyt/GO_AllLists.csv'
bodyParser.urlencoded({ extend: false })
bodyParser.json()
var firebase = require("firebase/app");
var firebaseConfig = {
  apiKey: "AIzaSyAizp5ydRlb-yGlrkY51StA4fXAEJ1OBms",
  databaseURL: "https://fatplant-76987.firebaseio.com",
  projectId: "fatplant-76987"
};

firebase.initializeApp(firebaseConfig);

exports.blastp = functions.https.onRequest((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    var matrix = req.query.matrix;
    var database = req.query.database;
    var evalue = req.query.evalue;
    if (database === undefined) {
      database = "Arabidopsis"
    }
    if (matrix === undefined) {
      matrix = "BLOSUM62"
    }
    if (evalue === undefined) {
      evalue = "10"
    }
    var fasta = req.query.fasta;
    var time = new Date().getTime();
    var inputname='/tmp/' + time + 'input.faa';
    var outputname='/tmp/' + time + 'output.txt';
    console.log(inputname);
    console.log(outputname);
    fs.writeFile(inputname, fasta.toString(), {
      encoding: 'utf8',
      mode: 438,
      flag: 'w'
    }, function (err) {
        if(err){
          console.error("fs error")
          res.send("fs error")
        }
    })
      childp.exec('ncbi-blast-2.9.0+/bin/blastp -matrix ' + matrix + ' -evalue ' + evalue + ' -query ' + inputname +' -db ./' + database + '/' + database + ' -out '+ outputname, function (error, stdout, stderr) {
  
      if (error) {
        console.error('error: ' + error);
        res.send("cp error");
      }
      else{
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + typeof stderr);
        let txt = fs.readFileSync(outputname, 'utf8');
        res.send(txt);
        fs.unlink(inputname, function (err) {
          if (err) throw err;
          console.log('Input File deleted!');
        }); 
        fs.unlink(outputname, function (err) {
          if (err) throw err;
          console.log('Output File deleted!');
        }); 

      }
      
    });
    
  });

  exports.oneclick = functions.https.onRequest((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    var database = req.query.database;
    if (database === undefined) {
      database = "Arabidopsis"
    }
    var fasta = req.query.fasta;
    var time = new Date().getTime();
    var inputname='/tmp/' + time + 'input.faa';
    var outputname='/tmp/' + time + 'output.txt';
    fs.writeFile(inputname, fasta.toString(), {
      encoding: 'utf8',
      mode: 438,
      flag: 'w'
    }, function (err) {
      if(err){
        console.error("fs error")
        res.send("fs error")
      }
  
    })
  
    childp.exec('ncbi-blast-2.9.0+/bin/blastp -matrix BLOSUM62 -query ' + inputname + ' -db ./' + database + '/' + database + ' -out '+ outputname, function (error, stdout, stderr) {
  
      if (error) {
        console.error('error: ' + error);
        res.status(200).send(error);
        return;
      }
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + typeof stderr);
      let txt = fs.readFileSync(outputname, 'utf8');
      console.log(txt);
      res.send(txt);
      //res.send(stdout)
      fs.unlink(inputname, function (err) {
        if (err) throw err;
        console.log('Input File deleted!');
      }); 
      fs.unlink(outputname, function (err) {
        if (err) throw err;
        console.log('Output File deleted!');
      }); 
    });
  });

  exports.ppidata = functions.https.onRequest((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  
    let requestedPathway = req.query.pathway;
    let pathwayArray = [];
    console.log(requestedPathway)
  
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(csvProteinPathways)
    });
  
    lineReader.on('line', function (line) {
      // console.log('Line from file:', line);
      if (line.includes(requestedPathway)) {
        // console.log(line)
        pathwayArray = line.split(',')
        pathwayArray = pathwayArray.filter(function (el) {
          return el !== '';
        });
      }
    });
    setTimeout(function () {
      return csv().fromFile(csvFilePath)
      .then((jsonObj) => {
        var elements = [];
        var genes = [];
        var groupNum = 1;
        var nodeCount = 0
        //number of object
        for (var i = 0; i < jsonObj.length; i++) {
  
          if (jsonObj[i].combined_score < 0.952) {
            continue;
          }
  
          if (groupNum > 11) {
            groupNum = 1;
          }
  
          let node1 = jsonObj[i].node1;
          let node2 = jsonObj[i].node2;
          if (!node1) {
            continue;
          }
          else if (!node2) {
            continue;
          }
          if (!pathwayArray.includes(node1)) {
            continue;
          }
          else if (!pathwayArray.includes(node2)) {
            continue;
          }
  
          // if node not already mapped
          if (!genes.includes(node1)) {
            genes.push(node1)
  
            // node a
            var data = {};
            var nodeModel = {};
            data["id"] = node1;
            data["name"] = node1;
            data["score"] = 0;
            data["gene"] = true;
            nodeModel["data"] = data;
            nodeModel["group"] = "nodes"
            elements.push(nodeModel);
            nodeCount++
  
          }
  
          // if node not already mapped
          if (!genes.includes(node2)) {
            genes.push(node2)
  
            //node b
            data = {};
            nodeModel = {};
            data["id"] = node2;
            data["name"] = node2;
            data["score"] = 0;
            data["gene"] = true;
            nodeModel["data"] = data;
            nodeModel["group"] = "nodes"
            elements.push(nodeModel);
            nodeCount++
          }
  
          for (var j = 0; j < elements.length; j++) {
            var tempModel = elements[j]
            if (tempModel["data"]["name"] === node2) {
              tempModel["data"]["score"] += 0.0004;
            }
            else if (tempModel["data"]["name"] === node1) {
              tempModel["data"]["score"] += 0.0004;
            }
          }
  
          // edge
          data = {};
          nodeModel = {};
          data["source"] = node1;
          data["target"] = node2;
          data["weight"] = jsonObj[i].combined_score / 1.2;
          data["group"] = groupNum.toString();
          nodeModel["data"] = data;
          nodeModel["group"] = "edges"
          elements.push(nodeModel);
  
          groupNum++;
        }
  
        let repsonse = [elements, pathwayArray]
  
        res.send(repsonse);
        return;
  
      })
    },2000)
    
  });
  
  exports.ppinodedescription = functions.https.onRequest((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  
    return csv().fromFile(csvNodeDescriptions)
      .then((jsonObj) => {
        res.send(jsonObj);
        return;
      });
  });
  
  exports.gonodedescription = functions.https.onRequest((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  
    return csv().fromFile(csvNodeDescriptions1)
      .then((jsonObj) => {
        res.send(jsonObj);
        return;
      });
    // request.get('https://www.kegg.jp/kegg/rest/keggapi.html', function (error, response, body) {
    //     console.log('error:', error); // Print the error if one occurred 
    //     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
    //     console.log('body:', body); //Prints the response of the request. 
    //   });
    //   res.status(200).send("Success");
  });
  
  exports.godata = functions.https.onRequest((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  
    //---csv data template start--
  
    // { SUID: '3978',
    //     BEND_MAP_ID: '1129198',
    //     Gene_A: 'GO:0051276',
    //     Gene_B: 'GO:0071103',
    //     interaction: 'Direct',
    //     name: '',
    //     Name_A: 'GO:0051276',
    //     Name_B: 'GO:0071103',
    //     SCORE: '0.441367118',
    //     selected: 'FALSE',
    //     'shared interaction': 'Direct',
    //     'shared name': '',
    //     source: '124',
    //     source_original: '',
    //     target: '107',
    //     target_original: '',
    //     TYPE: 'Direct' },
    // -- csv data end---
    let identifier = req.query.identifier;
    var ifsearch = true;
    if (identifier === undefined) {
      ifsearch = false;
    }
    // let identifier = "PAP1"
    let nodeArray = [];
    console.log(identifier)
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(csvEntityTableFilePath)
    });
  
    lineReader.on('line', function (line) {
  
      // console.log('Line from file:', line);
      if (line.includes(identifier)) {
        // console.log(line)
        var tmp = line.split(',')
        console.log(tmp[0])
        if (tmp[0].length > 0) {
          nodeArray.push(tmp[0])
        }
      }
  
    });
    setTimeout(function () {
      // console.log(nodeArray);
      return csv().fromFile(csvFilePath1)
        .then((jsonObj) => {
          var elements = [];
          var genes = [];
          var nodes = [];
          var groupNum = 1;
          //number of object
          // console.log("!")
          for (var i = 0; i < jsonObj.length; i++) {
            if (groupNum > 11) {
              groupNum = 1;
            }
            if (ifsearch) {
              let node1 = jsonObj[i].Gene_A;
              let node2 = jsonObj[i].Gene_B;
              if (!node1) {
                continue;
              }
              else if (!node2) {
                continue;
              }
              if (!nodeArray.includes(node1) && !nodeArray.includes(node2)) {
                continue;
              }
            }
  
  
            // if node not already mapped
            if (!genes.includes(jsonObj[i].Gene_A)) {
              genes.push(jsonObj[i].Gene_A)
  
              // node a
              var data = {};
              var nodeModel = {};
              data["id"] = jsonObj[i].Gene_A;
              data["name"] = jsonObj[i].Gene_A;
              data["score"] = 0;
              data["gene"] = true;
              nodeModel["data"] = data;
              nodeModel["group"] = "nodes"
              elements.push(nodeModel);
  
            }
  
            // if node not already mapped
            if (!genes.includes(jsonObj[i].Gene_B)) {
              genes.push(jsonObj[i].Gene_B)
  
              //node b
              data = {};
              nodeModel = {};
              data["id"] = jsonObj[i].Gene_B;
              data["name"] = jsonObj[i].Gene_B;
              data["score"] = 0;
              data["gene"] = true;
              nodeModel["data"] = data;
              nodeModel["group"] = "nodes"
              elements.push(nodeModel);
            }
  
            for (var j = 0; j < elements.length; j++) {
              var tempModel = elements[j]
              if (tempModel["data"]["name"] === jsonObj[i].Gene_B) {
                tempModel["data"]["score"] += 0.0004;
              }
              else if (tempModel["data"]["name"] === jsonObj[i].Gene_A) {
                tempModel["data"]["score"] += 0.0004;
              }
            }
  
            // edge
            data = {};
            nodeModel = {};
            data["source"] = jsonObj[i].Gene_A;
            data["target"] = jsonObj[i].Gene_B;
            data["weight"] = jsonObj[i].SCORE / 1.2;
            data["group"] = groupNum.toString();
            nodeModel["data"] = data;
            nodeModel["group"] = "edges"
            elements.push(nodeModel);
  
            groupNum++;
          }
  
  
  
          // console.log(elements)
  
          // -- elements template start--
  
          // elements: [{
          //     "data": {
          //       "id": "605755",
          //       "name": "PCNA",
          //       "score": 1,
          //       "gene": true
          //     },
          //     "group": "nodes",
          //   }, {
          //     "data": {
          //       "id": "611408",
          //       "name": "FEN1",
          //       "score": 1,
          //       "gene": true
          //     },
          //     "group": "nodes"
          //   }, {
          //     "data": {
          //       "source": "605755",
          //       "target": "611408",
          //       "weight": 1,
          //       "group": "1",
          //     },
          //     "group": "edges",
          //   }]
  
          // console.log(elements);
          res.send(elements);
          return;
  
        })
    }, 2000);
  });

  exports.kegg = functions.https.onRequest((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    var id = req.query.id;
    var cfg = req.query.cfg;
    var para = req.query.para;
    if (id === undefined) {
      id = "hsa05130";
    }
    if (cfg === undefined) {
      cfg = "get";
    }
    if (para === undefined) {
      para = "conf";
    }
    var url = '';
    if (cfg === 'get'){
      url = 'http://rest.kegg.jp/get/' + id + '/' + para;
    }
    if (cfg === 'link'){
      url = 'http://rest.kegg.jp/link/pathway/' + id;
    }
    if (url != undefined && url != ''){
      request.get(url).pipe(res);
    }
    
  });