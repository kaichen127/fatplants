const admin = require('firebase-admin');
const serviceAccount = require("./fatplant-76987-firebase-adminsdk-bn4zq-fd24835c87.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fatplant-76987.firebaseio.com"
});

const data = require("./more-aralips.json");

data && Object.keys(data).forEach(key => {
    const nestedContent = data[key];

    if (typeof nestedContent === "object") {
        Object.keys(nestedContent).forEach(docTitle => {
            admin.firestore()
                .collection(key)
                .add(nestedContent[docTitle])
                .then((res) => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
    }
});