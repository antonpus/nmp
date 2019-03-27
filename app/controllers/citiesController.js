import City from '../models/city';

class CitiesController {
    constructor() {
    }

    create(req, res) {
        new City(req.body).save((err, city) => {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.status(201).send(city);
        });
    }

    update(req, res) {
        const city = {
            ...req.body,
            lastModifiedDate: new Date()
        };

        City.findOneAndUpdate({'_id': req.params.id}, city, {upsert: true, new: true}, (err, city) => {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.status(200).send(city);
        });
    }

    remove(req, res) {
        City.findByIdAndRemove(req.params.id, err => {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.status(204).send();
        })
    }

    getAll(req, res) {
        City.find({}, (err, cities) => {
            if (err) {
                res.status(400).send(error);
                return;
            }
            res.status(200).send(cities);
        });
    }
}

const citiesController = new CitiesController();

export default citiesController;