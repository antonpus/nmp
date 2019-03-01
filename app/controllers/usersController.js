import UsersRepository from '../repositories/usersRepository'

class UsersController {
    constructor() {
        this.repository = new UsersRepository();
    }

    getAll(req, res) {
        return res.status(200).send(this.repository.findAll());
    }
}

export default UsersController;