# Firestore-Connection Service

Author: Matt Hudson

### Purpose

The firestore-connection service provides a common accessor for firebase collections in our database.

### Methods

`connect(collectionName: string): Observable`: provide the name of a colleciton, and this method will return an Observable you can subscribe to for the collection. Observables follow this pattern: call the method, then call .subscribe on the result and pass a handler function. Example: `connect("soybean").subscribe(res => {// handler});`

`getNews(): Observable`: Similar method to `connect` but strictly for obtaining the list of news items in the database.