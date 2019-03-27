const mongo = require('mongodb').MongoClient;
const config = require('../config/appconfig');

const data = [
    {
        name: 'Minsk',
        country: 'Belarus'
    },
    {
        name: 'Brest',
        country: 'Belarus'
    }
];

const insertDocuments = (db, done) => {
    const collection = db.collection('cities');
    collection.insertMany(data, (err, result) => {
        if (err) {
            done(err);
            return;
        }
        done(result);
    });
};

mongo.connect(config.mongodb.url, (err, client) => {
    if (err) {
        console.error(err);
    }
    console.log("Connected successfully to mongodb");
    const db = client.db(config.mongodb.db);

    insertDocuments(db, docs => {
        console.log(docs);
        client.close()
    });
});
