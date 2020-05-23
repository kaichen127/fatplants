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
                console.dir(res);
                // todo, write this output somewhere
            });
            
          
            
        } catch (e) {
            console.error("The file " + fatplantFile + "does not exist or you do not have permission to read it.");
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
            Use sparingly to avoid overreading! :)
        
        `);
        break;
    default:
        console.log("Invalid command - use node uniprot-scraper.js help for available commands.");
        break;
}

async function callUniprotAPI(uIdList) {
    var uIdEntries = [];
    return await async.each(uIdList, (uId, done) => {
        // todo: run the api calls using fetch, make sure to stagger the requests, then parse the output.
        uIdEntries.push(uId);
        done();
    }).then(err => {
        return uIdEntries;
    });
}


