/*
    Fatplant Uniprot Scraper
    Author: Matt Hudson

    This scraper scans https://uniprot.org for relevant details regarding feature data.

    Usage: node uniprot-scraper.js <command>
    Commands:
        get-fatplant => queries the fatplant database to obtain a list of uniprot ids present. Exported to fatplant-uniprots.json
        WARNING: This is a read-intensive process, only run when necessary to conserve firebase reads.

*/

// firebase setup and imports
var admin = require('firebase-admin');
var serviceAccount = require('./firebase-credentials.json');
var fs = require('fs');
var async = require('async');
var fetch = require('node-fetch');
var XML = require('fast-xml-parser');

const uniprotUrl = "https://uniprot.org/uniprot/";
const fatplantFile = "./fatplant-uniprots.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fatplant-76987.firebaseio.com"
});

var fatplantdb = admin.firestore();

args = process.argv;

if (args.length > 2) var command = args[2];

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

switch(command) {
    case undefined:
        console.log("Specify an option to the script - use node uniprot-scraper.js help for available commands.");
        process.exit(-1);
        break;
    case "get-fatplant":
        readline.question(`WARNING: this operation is read-intensive. Only perform this operation if necessary to update the locally available uniprot IDs.
        Do you want to continue (Y/N)? > `, (response) => {
            if (response === "Y" || response === "y") {
                var arapidopsisCollection = fatplantdb.collection('Lmpd_Arapidopsis');
                var uniprotIdList = [];
                console.log("Gathering Arapidopsis ids...");
                arapidopsisCollection.select("uniprot_id").get().then(res => {
                    res.forEach(doc => {
                        uniprotIdList.push(doc.get("uniprot_id"));
                    });
                    var soybeanCollection = fatplantdb.collection('Soybean');
                    console.log("Gathering Soybean ids...");
                    soybeanCollection.select("UniprotID").get().then(res => {
                        res.forEach(doc => {
                            uniprotIdList.push(doc.get("UniprotID"));
                        });
                        fs.writeFileSync(fatplantFile, JSON.stringify(uniprotIdList));
                        console.log(uniprotIdList.length + " Uniprot IDs found and added to " + fatplantFile + "!");
                        console.log("If further updates are necessary, make sure to check firebase read usage on the firebase console to avoid overcharges.");
                        readline.close();
                        process.exit(0);
                    });
                });
            }
            else {
                readline.close();
                process.exit(0);
            }
        });
        break;
    
    case "get-uniprot-data":
        try {
            let uniprotIdFileContents = fs.readFileSync(fatplantFile);
            let uniprotIdList = JSON.parse(uniprotIdFileContents.toString());
            console.log("Found " + uniprotIdList.length + " Uniprot IDs to check!"); 
            console.log("Running API calls...");
            callUniprotAPI(uniprotIdList).then(res => {
                try {
                    fs.writeFileSync('./uniprot-data.json', JSON.stringify(res));
                    console.log("API calls successful! Data written to uniprot-data.json");
                } catch (e) {
                    console.error("Unable to write to uniprot-data.json! Ensure you have permissions to write in the current directory.");
                } finally {
                    process.exit(0);
                }
            });
            
          
            
        } catch (e) {
            console.error("The file " + fatplantFile + "does not exist or you do not have permission to read it.");
            process.exit(-1);
        }
        break;

    case "help":
        console.log(`
        Fatplant Uniprot Scraper
        Author: Matt Hudson

        This scraper scans https://uniprot.org for relevant details regarding feature data.

        Usage: node uniprot-scraper.js <command>
        Commands:
            get-fatplant => queries the fatplant database to obtain a list of uniprot ids present. Exported to fatplant-uniprots.json.
            Use sparingly to avoid overreading the FatPlant firestore.

            get-uniprot-data => reads in a list of uniprot IDs from fatplant-uniprots.json, then queries https://uniprot.org for relevant data.
            Output is sent to uniprot-data.json. API requests are throttled to prevent overloading the host system and web server. This parameter
            can be changed in the script \`numOfAPICallsAtOneTime\` in the callUniprotAPI() function.

            help => displays this message.
        
        `);
        process.exit(0);
        break;
    default:
        console.log("Invalid command - use node uniprot-scraper.js help for available commands.");
        process.exit(0);
        break;
}

async function callUniprotAPI(uIdList) {
    var uIdEntries = [];
    var i = 0;
    var errors = 0;
    // requests are throttled to prevent failed requests. This can be increased but can lead to rejected responses.
    var numOfAPICallsAtOneTime = 50;
    return await async.eachLimit(uIdList, numOfAPICallsAtOneTime, (uId, done) => {
        fetch(uniprotUrl + uId + ".xml").then(res => { return res.text() })
            .then(xml => {
                let data = XML.parse(xml, { ignoreAttributes: false, attributeNamePrefix: "" });
                uIdEntries.push({
                    uniprot_id: uId,
                    data: data.uniprot.entry.feature
                });
                i++;
                process.stdout.write("Uniprot ID: " + i + " / " + uIdList.length + " - " + ((i / uIdList.length * 100).toPrecision(3)) + "%   " + "\r");
                done();
            }).catch(e => {
                // API call failed
                errors++;
                console.log('API call failed for ID ' + uId + "            ");
                done();
            });
    }).then(err => {
        console.log(errors + " API calls failed. Some entries have no data available, others may fail due to running too many requests at a time.");
        return uIdEntries;
    });
}


