import json
import firebase_admin
import google.cloud
#you will need to run pip install firebase-admin google-cloud-firestore
from firebase_admin import credentials, firestore

import re
import urllib

credentialsFile="fatplant-76987-firebase-adminsdk-u9bby-92e91a6996.json"
cred=credentials.Certificate(credentialsFile)
app=firebase_admin.initialize_app(cred)

client=firestore.client()

with open('data_soybean.json') as file:
    listofobj=json.load(file)
    ctr=0
    for obj in listofobj:
        for key in obj.keys():
            obj[key.replace(' ','')]=obj.pop(key)
        doc_ref=client.collection('Soybean').add(obj)
        print "doc added"
