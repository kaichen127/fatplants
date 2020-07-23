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
var lineReader = require('line-reader');

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

let data;

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

        // write 
    case "write-uniprot-data":
        data = JSON.parse(fs.readFileSync('./uniprot-data.json'));
        var uniprotData = [];
        data.forEach(entry => {
            if(entry.uniprot_id.length === 6) {
                uniprotData.push(entry);
            }
        });
        writeUniprots(uniprotData).then(() => {
            process.exit(0);
        });
        break;
    case "fix-protein-entries":
        fixProteinEntries();
        break;
    case "write-soybean-data":
        data = JSON.parse(fs.readFileSync('./uniprot-data.json'));
        var soybeanData = [];
        data.forEach(entry => {
            if(entry.uniprot_id.length !== 6) {
                soybeanData.push(entry);
            }
        });
        writeSoybean(soybeanData).then(() => {
            process.exit(0);
        });
        break;
    case "get-tair-ids":
        var uniprotsToTair = [];
        var fields = [];
        var tmpTairs;
        lineReader.eachLine('./uniprottoTAIR.txt', (line) => {
            fields = line.split('\t');
            if(line.includes("STOP")) {
                fs.writeFileSync('./uniprotToTair.json', JSON.stringify(uniprotsToTair));
                console.log('Written tair id json!');
                process.exit(0);
            }
            if(uniprotsToTair.find(entry => entry.uniprot_id === fields[0]) !== undefined) {
                uniprotsToTair.find(entry => entry.uniprot_id === fields[0]).tair_ids.push(fields[fields.length - 1]);
                tmpTairs = uniprotsToTair.find(entry => entry.uniprot_id === fields[0]).tair_ids;
                tairSet = new Set(tmpTairs);
                uniprotsToTair.find(entry => entry.uniprot_id === fields[0]).tair_ids = Array.from(tairSet);
            }
            else {
                uniprotsToTair.push({
                    uniprot_id: fields[0],
                    tair_ids: [fields[fields.length - 1]]
                });
            }
        });
        break;
    case "write-tair-ids":
        data = JSON.parse(fs.readFileSync('./uniprotToTair.json'));
        writeTairIds(data).then(() => {
            process.exit(0);
        })
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

async function fixProteinEntries() {
    return await fatplantdb.collection('Lmpd_Arapidopsis_Detail1').get().then(async(snap) => {
        return await async.eachLimit(snap.docs, 1, async(doc, done) => {
            if (doc.get('entry_name') !== undefined) return await fatplantdb.collection('Lmpd_Arapidopsis_Detail1').doc(doc.id).update({
                'entry_name': (doc.get('entry_name') !== undefined) ? doc.get('entry_name').replace('_ARATH', '') : undefined
            }).then(() => {console.log('written')});
            else return;
        });
    });
}

async function writeTairIds(uniprotToTairs) {
    return await async.eachLimit(uniprotToTairs, 1, (uniprotToTair, done) => {
        if(uniprotToTair.uniprot_id.length !== 6) done();
        fatplantdb.collection('Lmpd_Arapidopsis').where('uniprot_id', '==', uniprotToTair.uniprot_id).get().then(res => {
            res.forEach(doc => {
                fatplantdb.collection('Lmpd_Arapidopsis').doc(doc.id).update({tair_ids: uniprotToTair.tair_ids})
                .then(res => { console.log("Written " + uniprotToTair.uniprot_id) ; done()}).catch(error => {console.error('Document failed to write: ' + uniprotToTair.uniprot_id);});
            })
        }).catch(error => {console.error('database fail'); done()});
    })
}  
async function writeUniprots(uniprotData) {
    var count = 0;
    var total = uniprotData.length;
    return await async.eachLimit(uniprotData, 1, (uniprot, done) => {
        fatplantdb.collection('Lmpd_Arapidopsis').where('uniprot_id', '==', uniprot.uniprot_id).get().then((res) => {
            res.forEach((doc) => {
                let updates = {
                    dataset: (uniprot.data.dataset !== undefined) ? uniprot.data.dataset : undefined,
                    created: (uniprot.data.created !== undefined) ? uniprot.data.created : undefined,
                    modified: (uniprot.data.modified !== undefined) ? uniprot.data.modified : undefined,
                    version: (uniprot.data.version !== undefined) ? uniprot.data.version : undefined,
                    accession: (uniprot.data.accession !== undefined) ? uniprot.data.accession : undefined,
                    name: (uniprot.data.name !== undefined) ? uniprot.data.name : undefined,
                    recommendedName: (uniprot.data.protein.recommendedName !== undefined) 
                    ? (uniprot.data.protein.recommendedName.fullName['#text'] !== undefined)
                        ? uniprot.data.protein.recommendedName.fullName['#text'] 
                        : uniprot.data.protein.recommendedName.fullText 
                    : (uniprot.data.protein.submittedName !== undefined && uniprot.data.protein.submittedName.fullName !== undefined)
                        ? (uniprot.data.protein.submittedName.fullName['#text'] !== undefined)
                            ? uniprot.data.protein.submittedName.fullName['#text']
                            : uniprot.data.protein.submittedName.fullText
                        : undefined,
                    alternativeNames: (uniprot.data.protein.alternativeName !== undefined)
                    ? (uniprot.data.protein.alternativeName.map !== undefined)
                            ? uniprot.data.protein.alternativeName.map(nameObj => {
                            return (nameObj.fullName['#text'] !== undefined)
                                ? nameObj.fullName['#text']
                                : nameObj.fullName
                        })
                        : [uniprot.data.protein.alternativeName]
                    : [],
                    primaryGeneName: (uniprot.data.gene !== undefined && uniprot.data.gene.name !== undefined) ? (typeof uniprot.data.gene.name === 'object') ? (Object.values(uniprot.data.gene.name).filter(nameObj => {
                        return (nameObj.type === 'primary')
                    })[0] !== undefined) ? Object.values(uniprot.data.gene.name).filter(nameObj => {
                        return (nameObj.type === 'primary')
                    })[0]['#text'] : undefined : (uniprot.data.gene.name.filter(nameObj => {
                        return (nameObj.type === 'primary')
                    })[0] !== undefined) ? uniprot.data.gene.name.filter(nameObj => {
                        return (nameObj.type === 'primary')
                    })[0]['#text'] : undefined : undefined,
                    goReferences: (uniprot.data.dbReference !== undefined) ? uniprot.data.dbReference.filter(ref => {
                        return (ref.type === 'GO')
                    }) : undefined,
                    subcelluarLocations: (uniprot.data.comment !== undefined) ? (typeof uniprot.data.comment === 'object') ? Object.values(uniprot.data.comment).filter(ref => {
                        return ref.type === 'subcellular location'
                    }) : uniprot.data.comment.filter(ref => {
                        return ref.type === 'subcellular location'
                    }) : undefined,
                    features: (uniprot.data.feature !== undefined) ? (typeof uniprot.data.feature === 'object') ? Object.values(uniprot.data.feature).filter(feature => {
                        return (feature.type === 'modified residue'
                        || feature.type === 'region of interest'
                        || feature.type === 'DNA-binding region'
                        || feature.type === 'cross-link')
                    }) : uniprot.data.feature.filter(feature => {
                        return (feature.type === 'modified residue'
                        || feature.type === 'region of interest'
                        || feature.type === 'DNA-binding region'
                        || feature.type === 'cross-link')
                    }) : undefined
                };
                Object.keys(updates).forEach(key => {
                    if(updates[key] === undefined) delete updates[key];
                });
                fatplantdb.collection('Lmpd_Arapidopsis').doc(doc.id).update(updates)
                .then(res => { count++; console.log(count + ' / ' + total + '\r') ; done()}).catch(error => {count++;});
            });
        }).catch(error => {console.error('database fail'); console.dir(error); done()});
    });
}
async function writeSoybean(soybeanData) {
    let FieldValue = require('firebase-admin').firestore.FieldValue;
    return await async.eachLimit(soybeanData, 1, (uniprot, done) => {
        fatplantdb.collection('Soybean').where('UniprotID', '==', uniprot.uniprot_id).get().then((res) => {
            res.forEach((doc) => {
                let updates = {
                    dataset: (uniprot.data.dataset !== undefined) ? uniprot.data.dataset : undefined,
                    created: (uniprot.data.created !== undefined) ? uniprot.data.created : undefined,
                    modified: (uniprot.data.modified !== undefined) ? uniprot.data.modified : undefined,
                    version: (uniprot.data.version !== undefined) ? uniprot.data.version : undefined,
                    accession: (uniprot.data.accession !== undefined) ? uniprot.data.accession : undefined,
                    name: (uniprot.data.name !== undefined) ? uniprot.data.name : undefined,
                    recommendedName: (uniprot.data.protein.recommendedName !== undefined) ? (uniprot.data.protein.recommendedName.fullName['#text'] !== undefined)
                    ? uniprot.data.protein.recommendedName.fullName['#text'] : uniprot.data.protein.recommendedName.fullText : undefined,
                    primaryGeneName: (uniprot.data.gene !== undefined && uniprot.data.gene.name !== undefined) ? (typeof uniprot.data.gene.name === 'object') ? (Object.values(uniprot.data.gene.name).filter(nameObj => {
                        return (nameObj.type === 'primary')
                    })[0] !== undefined) ? Object.values(uniprot.data.gene.name).filter(nameObj => {
                        return (nameObj.type === 'primary')
                    })[0]['#text'] : undefined : (uniprot.data.gene.name.filter(nameObj => {
                        return (nameObj.type === 'primary')
                    })[0] !== undefined) ? uniprot.data.gene.name.filter(nameObj => {
                        return (nameObj.type === 'primary')
                    })[0]['#text'] : undefined : undefined,
                    goReferences: (uniprot.data.dbReference !== undefined) ? uniprot.data.dbReference.filter(ref => {
                        return (ref.type === 'GO')
                    }) : undefined,
                    subcelluarLocations: (uniprot.data.comment !== undefined) ? (typeof uniprot.data.comment === 'object') ? Object.values(uniprot.data.comment).filter(ref => {
                        return ref.type === 'subcellular location'
                    }) : uniprot.data.comment.filter(ref => {
                        return ref.type === 'subcellular location'
                    }) : undefined,
                    features: (uniprot.data.feature !== undefined) ? (typeof uniprot.data.feature === 'object') ? Object.values(uniprot.data.feature).filter(feature => {
                        return (feature.type === 'modified residue'
                        || feature.type === 'region of interest'
                        || feature.type === 'DNA-binding region'
                        || feature.type === 'cross-link')
                    }) : uniprot.data.feature.filter(feature => {
                        return (feature.type === 'modified residue'
                        || feature.type === 'region of interest'
                        || feature.type === 'DNA-binding region'
                        || feature.type === 'cross-link')
                    }) : undefined
                };
                Object.keys(updates).forEach(key => {
                    if(updates[key] === undefined) delete updates[key];
                });
                 fatplantdb.collection('Soybean').doc(doc.id).update(updates).then(res => { console.log("Written " + uniprot.uniprot_id) ; done()}).catch(error => {console.error('Document failed to write: ' + soybean.uniprot_id);});
            });
        }).catch(error => {console.error('database fail'); done()});
    });
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
                    data: data.uniprot.entry
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


