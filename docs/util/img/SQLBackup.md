# Backing Up Datasets to SQL

## Functions
There are 3 firebase cloud functions that can be executed to generate CSV documents that will work with the separate SQL database for the datasets page. These functions are lmpdToCsv, camelinaToCsv, and soybeanToCsv. They are stored as pubsub functions, and need to be triggered manually from the main Google Cloud console.

## Triggering the Functions
Go to the google cloud [main console](https://console.cloud.google.com/functions/list?authuser=1&project=fatplantsmu-eb07c) and navigate to the Pub/Sub [menu](https://console.cloud.google.com/cloudpubsub/topic/list?project=fatplantsmu-eb07c&authuser=1). Then click the topic with the name of the collection you want to create a CSV for.

![](./img/sqlbackup1.PNG)

Now click the messages tab on this page:

![](./img/sqlbackup2.PNG)

Click "publish message", then enter some text on the message body. Think of this as a message for commiting changes to a git repo, we just need a bit of context for why the CSV is being generated.

![](./img/sqlbackup3.PNG)

Finally, click publish, and the data will start to be exported. You will find the newly generated CSV files in the storage section of the firebase console. They can be downloaded from here.

![](./img/sqlbackup4.PNG)