import json
import firebase_admin
import google.cloud
#you will need to run pip install firebase-admin google-cloud-firestore
from firebase_admin import credentials, firestore

import re
import urllib

regex=r'\W+ acid'
credentialsFile="fatplant-76987-firebase-adminsdk-u9bby-92e91a6996.json"
cred=credentials.Certificate(credentialsFile)
app=firebase_admin.initialize_app(cred)

client=firestore.client()

with open('fattyacid.json') as file:
    listofobj=json.load(file)
    for obj in listofobj:
        del obj["_id"]
        if obj['Name']:
            obj['link']=urllib.quote('https://opsin.ch.cam.ac.uk/opsin/'+obj['Name'].encode('utf-8')+'.png')
            print obj['link']
        else:
            obj['link']=None
        doc_ref=client.collection('Fatty Acid').add(obj)
        # print "doc added"
