// mongodb-native library set
require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

var option = {
    useNewUrlParser: true,
    //number of retries off connection.
    numberOfRetries: 5,
    //reconnect on error
    auto_reconnect: true,
    // i suggest 10(the default size for nodejs is 5). datapool size.
    poolSize: 10,
    connectTimeoutMS: 500,

};



var connection = null;

// connect db
module.exports.connect = () => new Promise((resolve, reject) => {
    MongoClient.connect(process.env.DATABASE, option, function (err, db) {
        if (err) {

            reject(err);
            return;
        }
        resolve(db);

        connection = db.db(process.env.DATABASE_NAME);

    });
});

// getdb connection
module.exports.getconnect = () => {
    if (!connection) {
        throw new Error('Call mongodb connect first!');
    }
    return connection;
}
