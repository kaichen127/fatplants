const admin = require('firebase-admin');
const serviceAccount = require("./fatplantsmu-eb07c-firebase-adminsdk-lw8ae-f11b0173cc.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fatplantsmu-eb07c.firebaseio.com"
});

const data = require("./arabidopsis.json");

data.results.forEach(element => {
    // element.geneNames = element.geneNames.split(' ');

    // if (element.primaryGeneName)
    //     element.geneNames.unshift(element.primaryGeneName);

    let uniprotId = element.from;
    let geneObj = element.to.genes;
    let geneNames = [];
    let tairId = "";
    let crossRefObj = element.to.uniProtKBCrossReferences;
    let refseqIds = [];
    let refseqId = "";
    let proteinNames = "";

    if (element.to.proteinDescription.recommendedName == undefined) {
        proteinNames = element.to.proteinDescription.submissionNames[0].fullName.value;
    }
    else {
        proteinNames = element.to.proteinDescription.recommendedName.fullName.value;
    }

    geneObj.forEach(gene => {
        if (gene.geneName)
            geneNames.push(gene.geneName.value);

        if (gene.orderedLocusNames) {
            gene.orderedLocusNames.forEach(name => {
                geneNames.push(name.value);
            });
        }

        if (gene.orfNames){
            gene.orfNames.forEach(name => {
                geneNames.push(name.value);
            });
        }
    })
    
    crossRefObj.forEach(ref => {
        if (ref.database == "TAIR") {
            tairId = ref.properties[0].value;
        }

        if (ref.database == "RefSeq") {
            refseqIds.push(ref.id);
        }
    });

    refseqIds.forEach(id => {
        refseqId += id + "; ";
    });

    geneNames.forEach(geneName => {
        let entry = {
            geneName: geneName,
            refseq_id: refseqId,
            tair_id: tairId,
            uniprot_id: uniprotId,
            proteinNames: proteinNames
        }

        admin.firestore()
        .collection("OnestopTranslationExtended")
        .add(entry)
        .then((res) => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    });

    
})