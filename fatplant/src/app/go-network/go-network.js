var express = require('express');
var router = express.Router();
var fs = require('fs');
var db = require('./csv/db.js');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

const csvNodeDescriptions = './csv/GO_info.csv';
const csvFilePath='./csv/network.csv';
const csvEntityTableFilePath = './csv/GO_AllLists.csv';
const csv=require('csvtojson');

router.get('/', function(req, res, next) {
    res.render('dataPages/cytView', {
        title: 'GO Network',

    });
});

router.get('/node-description', function(req,res,next){

    csv().fromFile(csvNodeDescriptions)
        .then((jsonObj)=>{
            res.send(jsonObj);
        });
});


router.get('/entity-table', function(req,res,next){

    csv().fromFile(csvEntityTableFilePath)
        .then((jsonObj)=>{
            searchVariable = req.query.testVar;
            var entitiesToInclude = [];

            for (var i=0;i<jsonObj.length;i++){
                for (var key in jsonObj[i]) {
                    if (jsonObj[i].hasOwnProperty(key)) {
                        if(jsonObj[i][key] === ""){
                            delete jsonObj[i][key]
                        }
                    }
                }
            }


            //this could be change to id(primary) > number(current) for speed up the searching time...
            //I will just use skip() function for now.
            var dbo = db.getconnect();
            //{"_id": _id}
            tempResult = null;
            dbo.collection('LMPD').find({"gene_symbol":searchVariable.toUpperCase()}).toArray(function (err, result) {
                tempResult = result
                if(result.length > 0){
                    filterEntities()
                }
                else{
                    checkRefSeqId();
                }
            });

            function checkRefSeqId(){
                // find the real gene_symbol by checking if the search variable is a refseq_id
                dbo.collection('LMPD').find({"refseq_id":searchVariable.toUpperCase()}).toArray(function (err, result) {

                    tempResult = result
                    if(result.length > 0){
                        searchVariable = result[0]['gene_symbol']
                        filterEntities()
                    }
                    else{
                        checkMRnaId();
                    }
                });
            }

            function checkMRnaId(){
                // find the real gene_symbol by checking if the search variable is a mrna_id
                dbo.collection('LMPD').find({"mrna_id":searchVariable.toUpperCase()}).toArray(function (err, result) {

                    tempResult = result
                    if(result.length > 0){
                        searchVariable = result[0]['gene_symbol']
                        filterEntities()
                    }
                    else{
                        checkUniProtId()
                    }
                });
            }

            function checkUniProtId(){
                // find the real gene_symbol by checking if the search variable is a mrna_id
                dbo.collection('LMPD').find({"uniprot_id":searchVariable.toUpperCase()}).toArray(function (err, result) {

                    tempResult = result
                    if(result.length > 0){
                        searchVariable = result[0]['gene_symbol']
                        filterEntities()
                    }
                    else{
                        // TODO handle bad input param variable
                    }
                });
            }


            function filterEntities(){

                searchVariable = searchVariable.toLowerCase();

                for (var i=0;i<jsonObj.length;i++){
                    for (var key in jsonObj[i]) {
                        if(jsonObj[i][key].toLowerCase() === searchVariable){
                            entitiesToInclude.push(jsonObj[i]['GO'])
                            break;
                        }
                    }
                }

                res.send(entitiesToInclude);

            }

            /*

            { _id: 'pf_88',
            lmp_id: 'LMP011386',
            entrez_gene_id: 816538,
            gene_name: 'transcription factor PIF1',
            gene_symbol: 'PIL5',
            refseq_id: 'NP_179608',
            mrna_id: 'NM_127577',
            protein_gi: 30680909,
            sequence:
            'MHHFVPDFDTDDDYVNNHNSSLNHLPRKSITTMGEDDDLMELLWQNGQVVVQNQRLHTKKPSSSPPKLLPSMDPQQQPSSDQNLFIQEDEMTSWLHYPLRDDDFCSDLLFSAAPTATATATVSQVTAARPPVSSTNESRPPVRNFMNFSRLRGDFNNGRGGESGPLLSKAVVRESTQVSPSATPSAAASESGLTRRTDGTDSSAVAGGGAYNRKGKAVAMTAPAIEITGTSSSVVSKSEIEPEKTNVDDRKRKEREATTTDETESRSEETKQARVSTTSTKRSRAAEVHNLSERKRRDRINERMKALQELIPRCNKSDKASMLDEAIEYMKSLQLQIQMMSMGCGMMPMMYPGMQQYMPHMAMGMGMNQPIPPPSFMPFPNMLAAQRPLPTQTHMAGSGPQYPVHASDPSRVFVPNQQYDPTSGQPQYPAGYTDPYQQFRGLHPTQPPQFQNQATSYPSSSRVSSSKESEDHGNHTTG',
            seqlength: 478,
            uniprot_id: 'Q8GZM7',
            protein_entry: 'PIF1_ARATH',
            protein_name: 'transcription factor PIF1',
            taxid: 3702,
            species: 'Arabidopsis',
            species_long: 'Arabidopsis thaliana' }

            */
        });
});

router.get('/data',  function (req, res, next) {

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

    csv().fromFile(csvFilePath)
        .then((jsonObj)=>{
            var elements=[];
            var genes=[];
            var nodes=[];
            var groupNum = 1;
            //number of object
            console.log()
            for (var i=0;i<jsonObj.length;i++){

                if(groupNum > 11){
                    groupNum = 1;
                }

                // if node not already mapped
                if(!genes.includes(jsonObj[i].Gene_A)){
                    genes.push(jsonObj[i].Gene_A)

                    // node a
                    var data = {};
                    var nodeModel= {};
                    data["id"] = jsonObj[i].Gene_A;
                    data["name"] = jsonObj[i].Gene_A;
                    data["score"] = 0;
                    data["gene"] = true;
                    nodeModel["data"] =data;
                    nodeModel["group"] = "nodes"
                    elements.push(nodeModel);

                }

                // if node not already mapped
                if(!genes.includes(jsonObj[i].Gene_B)){
                    genes.push(jsonObj[i].Gene_B)

                    //node b
                    var data = {};
                    var nodeModel= {};
                    data["id"] = jsonObj[i].Gene_B;
                    data["name"] = jsonObj[i].Gene_B;
                    data["score"] = 0;
                    data["gene"] = true;
                    nodeModel["data"] =data;
                    nodeModel["group"] = "nodes"
                    elements.push(nodeModel);
                }

                for(var j=0; j<elements.length;j++){
                    var tempModel = elements[j]
                    if(tempModel["data"]["name"] == jsonObj[i].Gene_B){
                        tempModel["data"]["score"] += .0004;
                    }
                    else if(tempModel["data"]["name"] == jsonObj[i].Gene_A){
                        tempModel["data"]["score"] += .0004;
                    }
                }

                // edge
                var data ={};
                var nodeModel= {};
                data["source"]=jsonObj[i].Gene_A;
                data["target"]=jsonObj[i].Gene_B;
                data["weight"]=jsonObj[i].SCORE / 1.2;
                data["group"]= groupNum.toString();
                nodeModel["data"] =data;
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

            res.send(elements);

        })
});


module.exports = router;
