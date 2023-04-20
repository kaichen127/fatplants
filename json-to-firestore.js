const admin = require('firebase-admin');
const serviceAccount = require("./fatplantsmu-eb07c-firebase-adminsdk-75ayj-b4496a9067.json");
const fs = require("fs")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fatplant-76987.firebaseio.com"
});

admin.firestore().collection("Species_Mapper").get().then(data => {
    
    const applications = data.docs.map(doc => doc.data());
    
    fs.writeFile("species_mapper.csv", "arabidopsis, camelina, cs_id, glymine_max, uniprot_id\n", function (err) {
        
        if (err) {
            console.log(err);
        }
        else {
            applications.forEach(row => {

                let line = '"' + row.arabidopsis + '","' + row.camelina + '","' + row.cs_id + '","' + row.glymine_max + '","' + row.uniprot_id + '"\n';
        
                fs.appendFile("species_mapper.csv", line, function (err) { 
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
    });

});
