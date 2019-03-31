const City = require('../models/city');

const create = (req, res) => {
    new City(req.body).save((err, city) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(201).send(city);
    });
};

const update = (req, res) => {
    City.findOneAndUpdate({'_id': req.swagger.params.cityId.value}, req.body, {upsert: true, new: true}, (err, city) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).send(city);
    });
};

const remove = (req, res) => {
    City.findByIdAndRemove(req.swagger.params.cityId.value, err => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        console.log("deleted");

        res.status(204).send();
    })
};

const getAll = (req, res) => {
    City.find({}, (err, cities) => {
        if (err) {
            res.status(400).send(error);
            return;
        }
        res.status(200).send(cities);
    });
};

module.exports = {
    create: create,
    update: update,
    remove: remove,
    getAll: getAll
};