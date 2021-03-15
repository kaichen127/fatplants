# Aralip Pathways Documentation

## How it all works

This tool uses graphs and information from the Aralip pathway website found [here](http://aralip.plantbiology.msu.edu/pathways/pathways). The images are gif files (though, the image type shouldn't matter). Overlaid on these images are HTML chartmaps that contain RECT/POLYGON areas that contain links to both the Aralip website and Fatplants website.

The areas and links are provided by firebase. Each pathway is given a document that contains the link to the image (stored in firebase storage), the title, the name, and an array containing the information of each area. The frontend will populate a selector by grabbing the name property of each document in the AralipsPathways collection. When the user clicks one of the options, the frontend will pull the rest of the information for the selected document. Then the image and chartmap will be rendered based on this data. 

The user can use the toggle switch to determine which site they'd like the links on the areas to go to. By default, this is the Aralip website.

## Database Breakdown

Here is an example of the data found for one of the documents.

```
"AralipsPathways" : {                                                   // collection name
    "Signaling": {                                                      // document name
        "name" : "Signaling",                                           // display name for select element (essentially the shortened title of this pathway)
        "title": "Phospholipid Signaling",                              // full name of the pathway title
        "imgPath": "https://firebasestorage.googleapis.com/...",        // link to the pathway chart image
        "areas": [                                                      // array of areas for links
            {
                "coords": "256,604,292,616",                            // coordinates for the area
                "title": "Phosphatidylinositol-3-Kinase",               // title of the object we're highlighting
                "shape": "RECT",                                        // shape of the area (RECT or POLYGON)
                "link": "/enzymes/128",                                 // relative path of the Aralip pathway site for the object
                "fpLink": "https://www.fatplants.net/protein/P42339"    // full path of the fatplants link for the object
            },	

            ...

```

There are a couple ways you can add new documents to the collection. The most straightforward is to manually add entries to the firestore collection. While this is certainly the best way to modify the collection, it can take quite a long time if you're entering the entire pathway chart. It is best to create an external JSON file, then upload it to firestore as a collection.

## Uploading New Pathways

### Gather the Data

If you're going to pull data from the Aralip website, you'll want to grab the html for one of the chart objects. It should look something like this:

```
<MAP NAME="phospholipid_signaling">
    <AREA SHAPE=RECT HREF="/enzymes/128"  title="Phosphatidylinositol-3-Kinase "  COORDS="256,604,292,616">
    <AREA SHAPE=POLYGON HREF="/pathways/eukaryotic_phospholipid_synthesis_editing"  title="Eukaryotic Phospholipid Synthesis & Editing" COORDS="319,420, 320,420, 321,419, 322,419, 323,418, 324,417, 324,416, 325,416, 325,415, 325,414, 325,413, 325,412, 324,412, 324,411, 323,410, 322,409, 321,409, 320,408, 319,408, 318,408, 317,409, 316,409, 315,410, 314,411, 314,412, 313,413, 313,414, 313,415, 314,416, 314,417, 315,418, 316,419, 317,419, 318,420, 319,420">
    <AREA SHAPE=POLYGON HREF="/pathways/eukaryotic_phospholipid_synthesis_editing"  title="Eukaryotic Phospholipid Synthesis & Editing" COORDS="347,436, 348,436, 349,436, 350,436, 350,435, 351,435, 352,434, 352,433, 353,433, 353,432, 353,431, 353,430, 353,429, 353,428, 352,428, 352,427, 351,427, 351,426, 350,426, 349,425, 348,425, 347,425, 346,425, 345,425, 344,426, 343,427, 342,427, 342,428, 342,429, 341,430, 341,431, 342,432, 342,433, 342,434, 343,434, 343,435, 344,435, 344,436, 345,436, 346,436, 347,436">
    
    ...

</MAP>
 ```

 You'll notice that all the data defined in each document can be found here (except for the Fatplants link; we'll get to that later). With this data, we can begin to structure our JSON file.

 ```
{
    "AralipsPathways" : {                                                   
        "Signaling": {                                                      
            "name" : "Signaling",                                           
            "title": "Phospholipid Signaling",                              
            "imgPath": "",       
            "areas": [                                                      
                {
                    "coords": "256,604,292,616",                            
                    "title": "Phosphatidylinositol-3-Kinase",               
                    "shape": "RECT",                                        
                    "link": "/enzymes/128",                                 
                    "fpLink": ""
                },	
                {
					"coords": "319,420, 320,420, 321,419, 322,419, 323,418, 324,417, 324,416, 325,416, 325,415, 325,414, 325,413, 325,412, 324,412, 324,411, 323,410, 322,409, 321,409, 320,408, 319,408, 318,408, 317,409, 316,409, 315,410, 314,411, 314,412, 313,413, 313,414, 313,415, 314,416, 314,417, 315,418, 316,419, 317,419, 318,420, 319,420",
					"title": "Eukaryotic Phospholipid Synthesis & Editing",
					"shape": "POLYGON",
					"link": "/pathways/eukaryotic_phospholipid_synthesis_editing",
					"fpLink": ""
				},	

                ...
        }
    }
}
```

You'll then want to download the image from the Aralip site, and upload it to firebase storage. You'll be able to get a link for that image once it's uploaded, which you'll then paste into the imgPath property of the JSON object.

Finally, you'll need to find the corresponding data in Fatplants for each of the links. This can be done with the aralip_locations_mapping_to_fatplants_v excel sheet. If you don't have access, ask a member of the team for a copy. Generally, the number in the "/enzymes/x" can be searched on the spreadsheet and it will give you the link in Fatplants. These links will go in the fpLink property of each area object.

### Pushing the JSON to Firestore

To push data to Firestore, you'll need a couple things setup. First, you need to install the firebase admin CLI tool. If you do this in the Fatplants project, make sure to remove it when you eventually push changes to the repo.

```npm install firebase-admin```

Now you need to download a service account file to get proper authentication to update firestore.

First, navigate to the firebase console. Find the settings icon next to the "Project Overview" button. Click the icon and select "Project Settings". On the settings page, find the "Service accounts" tag and click it. Now click the "Generate new private key" button on the bottom of the page. This will download a file that you'll need to save somewhere in the Fatplants directory that you'll remember.

**MAKE SURE TO DELETE THIS FILE BEFORE PUSHING ANYTHING TO THE GIT REPO**

With your service file complete, you can now write some code to push JSON data to firebase. Here is a simple example of how to do it:

### JSON to Firestore Code

Create a new JavaScript file in the same directory as your service key and JSON file that you'd like to use.

The first part of the code should include the service account path info and the firebase admin library:

```
const admin = require('firebase-admin');
const serviceAccount = require("./fatplant-XXXXX-firebase-adminsdk-XXXXX-XXXXXXXXX.json");
```

Now you'll initialize the admin app, and get the JSON file:

```
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fatplant-76987.firebaseio.com"
});

const data = require("./data-to-upload.json");
```

Finally, parse the JSON into objects, then iterate over them and push each object inside the file. 

**Note: This specific code will not work for nested firestore objects.**

```
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
```
Now you can save the code and run it with the following command:

```node <javascript-filename>.js```

### Full Code 

```
const admin = require('firebase-admin');
const serviceAccount = require("./fatplant-XXXXX-firebase-adminsdk-XXXXX-XXXXXXXXX.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fatplant-76987.firebaseio.com"
});

const data = require("./data-to-upload.json");

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
```