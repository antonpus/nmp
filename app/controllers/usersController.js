import {User} from '../../db/postgres/models'

class UsersController {
    constructor() {
    }

    create(req, res) {
        return User.create(req.body)
            .then(user => res.status(201).send(user))
            .catch(error => res.status(400).send(error));
    }

    getAll(req, res) {
        return User.findAll()
            .then(users => res.status(200).send(users))
            .catch(error => res.status(400).send(error));
    }
}

const usersController = new UsersController();

export default usersController;