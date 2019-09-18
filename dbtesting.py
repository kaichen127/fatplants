import csv
import firebase_admin
import google.cloud
#you will need to run pip install firebase-admin google-cloud-firestore
from firebase_admin import credentials, firestore

credentialsFile="C:\\Users\\Jonah\\Downloads\\fatplant-76987-firebase-adminsdk-u9bby-92e91a6996.json"
cred=credentials.Certificate(credentialsFile)
app=firebase_admin.initialize_app(cred)

client=firestore.client()

csvFile="LMPD_Arabidopsis Only.csv"
collectionName="Lmpd_Arapidopsis"

docs=client.collection(collectionName).get()
for item in docs:
    print item.get({})
