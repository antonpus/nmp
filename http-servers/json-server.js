const http = require('http');
const mongo = require('mongodb').MongoClient;
const config = require('../config/appconfig');

const getRandomCity = cities => {
    if (cities && cities.length === 1) {
        return cities[0];
    }
    if (cities && cities.length > 1) {
        return cities[Math.floor(Math.random() * cities.length)];
    }
    return {};
};

const getCity = (db, done) => {
    const collection = db.collection('cities');
    collection.find({}).toArray((err, cities) => {
        if (err) {
            done(err);
            return;
        }
        done(null, getRandomCity(cities));
    });
};

const main = () => mongo.connect(config.mongodb.url, (err, dbclient) => {
    if (err) {
        console.error(err);
    }
    const db = dbclient.db(config.mongodb.db);

    http.createServer((req, res) => {
        getCity(db, (err, city) => {
            if (err) {
                res.statusCode = 500;
                res.end('Something bad happened');
                return;
            }
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(city));
        });
    }).listen('8080', 'localhost');
});

main();
