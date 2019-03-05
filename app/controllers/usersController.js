import usersRepository from '../repositories/usersRepository'

class UsersController {
    constructor() {
    }

    getAll(req, res) {
        return res.status(200).send(usersRepository.findAll());
    }
}

const usersController = new UsersController();

export default usersController;