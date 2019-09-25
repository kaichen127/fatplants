import csv
import firebase_admin
import google.cloud
#you will need to run pip install firebase-admin google-cloud-firestore
from firebase_admin import credentials, firestore

credentialsFile=""
cred=credentials.Certificate(credentialsFile)
app=firebase_admin.initialize_app(cred)

client=firestore.client()

csvFile=" "
collectionName=" "


data=[]
fields=[]

with open(csvFile) as csv_file:
	csv_reader=csv.reader(csv_file)
	firstLine=True
	ctr=0
	for row in csv_reader:
		# print ctr
		ctr+=1
		if firstLine:
			for elem in row:
				fields.append(elem)
			firstLine=False
		else:
			jsonobj={}
			for index, item in enumerate(row):
				jsonobj[fields[index]]=item.strip().decode()
			data.append(jsonobj)

for document in data:
	# print document
	doc_ref=client.collection(collectionName).add(document)
	print "doc added"
