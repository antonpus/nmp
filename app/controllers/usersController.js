import User from '../models/user'

class UsersController {
    constructor() {
        this.users = [new User('Alex'), new User('Ben')];
    }

    getAll(req, res) {
        return res.status(200).send(this.users);
    }
}

export default UsersController;