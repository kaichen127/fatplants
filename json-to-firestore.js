const admin = require('firebase-admin');
const serviceAccount = require("./fatplantsmu-eb07c-firebase-adminsdk-lw8ae-f11b0173cc.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fatplantsmu-eb07c.firebaseio.com"
});

const data = require("./species_map.json");

data.forEach(element => {
    // element.geneNames = element.geneNames.split(' ');

    // if (element.primaryGeneName)
    //     element.geneNames.unshift(element.primaryGeneName);

    admin.firestore()
        .collection("Species_Mapper")
        .add(element)
        .then((res) => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
})