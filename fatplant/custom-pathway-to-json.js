const admin = require('firebase-admin');
const serviceAccount = require("./fatplant-76987-firebase-adminsdk-bn4zq-cd6fff3e37.json");

const fs = require('fs');
const readline = require('readline');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fatplant-76987.firebaseio.com"
});

const readInterface = readline.createInterface({
    input: fs.createReadStream('custom-pathway-input.json'),
    console: false
});

var pathObject = {
    areas: [],
    imgPath: "https://firebasestorage.googleapis.com/v0/b/fatplant-76987.appspot.com/o/images%2FcustomPathwayImages%2Fcin_00006.png?alt=media&token=201ed305-6f60-45c2-b581-6fd6ab817475",
    name: "Test Path Object 2",
    title: "Test Pathway 2"
};

// convert the data to a usable object
readInterface.on('line', function(line) {
    // break into initial segments
    var segments = line.split(" ");

    // remove parenthesis from coordinates
    segments[1] = segments[1].substring(1, segments[1].length);
    segments[2] = segments[2].substring(0, segments[2].length - 1);

    segments[3] = segments[3].substring(1, segments[3].length);
    segments[4] = segments[4].substring(0, segments[4].length - 1);

    // create coords string
    var coords = segments[1] + segments[2] + ',' + segments[3] + segments[4];
    
    // grab segmets of the link so we can get the ID portion
    var linkSegments = segments[5].split("/");

    // build object
    var documentObject = {
        shape: segments[0],
        coords: coords,
        uniProtLink: segments[5],
        fpLink: "https://www.fatplants.net/protein/" + linkSegments[linkSegments.length - 1],
        title: segments[6]
    };

    pathObject.areas.push(documentObject);
});

readInterface.on('close', function(summary) {
    admin.firestore()
    .collection("CustomizedPathways")
    .add(pathObject)
    .then((res) => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
});