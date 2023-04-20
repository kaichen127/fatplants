const admin = require('firebase-admin');
const serviceAccount = require("../fatplantsmu-eb07c-firebase-adminsdk-75ayj-b4496a9067.json");
const parserCSV = require("json2csv");
const fs = require('fs');
const res = require('./csvjson.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fatplantsmu-eb07c.firebaseio.com"
});

admin.firestore().collection("Fatty Acid").get().then(applicationSnapshot => {

    //const res = JSON.parse(jsonFile);
    const indexFields = [
        "DataPoints",
        "Delta-Notation",
        "Formula",
        "Mass",
        "OtherNames",
        "PhyloTree",
        "SOFAID",
        "SystematicName"
    ];

    var newObjsIndex = [];

    const applications = applicationSnapshot.docs.map(doc => doc.data());

    applications.forEach(row => {
        newObjsIndex.push({
            DataPoints: row.DataPoints,
            "Delta-Notation": row["Delta-Notation"],
            Formula: row.Formula,
            Mass: row.Mass,
            OtherNames: row.OtherNames,
            PhyloTree: row.PhyloTree,
            SOFAID: row.SOFAID,
            SystematicName: row.SystematicName
        });
    });

    const outputIndex = parserCSV.parse(newObjsIndex, { indexFields });

    const dateTime = new Date().toISOString().replace(/\W/g, "");
    const indexFileName = `Fatty_Acid_${dateTime}.csv`;

    const tempLocalIndexFile = "C:\\Users\\Trey\\Desktop\\FPTest\\FPDataPages\\" + indexFileName;


    fs.writeFile(tempLocalIndexFile, outputIndex, error => {
        if (error) {
            reject(error);
            return;
        }
    });
}).catch(err => {console.log(err)});

// LEFTOVER FIELDS FROM SOYBEAN_DETAILS
// // CSV headers
// const indexFields = [
//     'Absorption',
//     'Active site',
//     'Activity regulation',
//     'Binding site',
//     'Catalytic activity',
//     'Caution',
//     'Chain',
//     'Cofactor',
//     'Comments',
//     'Cross-link',
//     'DNA binding',
//     'Disulfide bond',
//     'Domain [CC]',
//     'Domain [FT]',
//     'EC number',
//     'Features',
//     'Glycosylation',
//     'Initiator methionine',
//     'Keyword ID',
//     'Kinetics',
//     'Lipidation',
//     'Modified residue',
//     'Motif',
//     'PDB',
//     'Pathway',
//     'Peptide',
//     'Post-translational modification',
//     'Propeptide',
//     'Redox potential',
//     'Rhea ID',
//     "Sequence",
//     'Signal peptide',
//     'Site',
//     'Temperature dependence',
//     'Transit peptide',
//     'UniParc',
//     'function',
//     'gene_names',
//     'gene_ontology_biological',
//     'gene_ontology_cellular',
//     'gene_ontology_go',
//     'gene_ontology_molecular',
//     "glyma_id",
//     'keywords',
//     'length',
//     'organism_id',
//     'pH dependence',
//     'pathway',
//     'pdb',
//     'protein_name',
//     'refseq_id',
//     'status',
//     'uniprot_id'
// ];

// var newObjsIndex = [];
// //var newObjsIndentifier = [];

// applications.forEach(row => {

//     var fp_obj = res.find(item => item.uniprot_id == row.uniprot_id);
//     var fp_id = "";

//     if (fp_obj)
//         fp_id = fp_obj.fatplant_id;

//     else {
//         console.log(row.uniprot_id);
//     }

//     newObjsIndex.push({
//     "Absorption": row["Absorption"],
//     "Active site": row["Active site"],
//     "Activity regulation": row["Activity regulation"],
//     'Binding site': row['Binding site'],
//     "Catalytic activity": row["Catalytic activity"],
//     "Caution": row["Caution"],
//     "Chain": row["Chain"],
//     "Cofactor": row["Cofactor"],
//     "Comments": row["Comments"],
//     'Cross-link': row['Cross-link'],
//     'DNA binding': row['DNA binding'],
//     "Disulfide bond": row["Disulfide bond"],
//     'Domain [CC]': row['Domain [CC]'],
//     'Domain [FT]': row['Domain [CC]'],
//     "EC number": row["EC number"],
//     'Features': row['Features'],
//     "Glycosylation": row["Glycosylation"],
//     "Initiator methionine": row["Initiator methionine"],
//     "Keyword ID": row["Keyword ID"],
//     "Kinetics": row["Kinetics"],
//     "Lipidation": row["Lipidation"],
//     "Modified residue": row["Modified residue"],
//     "Motif": row["Motif"],
//     'PDB': row["PDB"],
//     'Pathway': row["Pathway"],
//     "Peptide": row["Peptide"],
//     'Post-translational modification': row['Post-translational modification'],
//     "Propeptide": row["Propeptide"],
//     "Redox potential": row["Redox potential"],
//     "Rhea ID": row["Rhea ID"],
//     "Sequence": row["Sequence"],
//     "Signal peptide": row["Signal peptide"],
//     "Site": row["Site"],
//     "Temperature dependence": row["Temperature dependence"],
//     "Transit peptide": row["Transit peptide"],
//     "UniParc": row["UniParc"],
//     "function": row["function"],
//     "gene_names": row["gene_names"],
//     "gene_ontology_biological": row["gene_ontology_biological"],
//     "gene_ontology_cellular": row["gene_ontology_cellular"],
//     "gene_ontology_go": row["gene_ontology_go"],
//     "gene_ontology_molecular": row["gene_ontology_molecular"],
//     "glyma_id": row["glyma_id"],
//     "keywords": row["keywords"],
//     "length": row["length"],
//     "organism_id": row["organism_id"],
//     "pH dependence": row["pH dependence"],
//     "protein_name": row["protein_name"],
//     "refseq_id": row["refseq_id"],
//     "status": row["status"],
//     'uniprot_id': row["uniprot_id"],
//     'fatplant_id': fp_id
//     });
// });