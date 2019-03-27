import User from '../models/user';

class UsersRepository {
    constructor() {
        this.users = [new User('u123', 'User 123', 'user123@mail.com', 'pass123'),
            new User('u234', 'User 234', 'user234@mail.com', 'pass234')]
    }

    findByEmail(email) {
        return this.users.find(usr => usr.email === email);
    }

    findAll() {
        return this.users;
    }
}

const usersRepository = new UsersRepository();

export default usersRepository;