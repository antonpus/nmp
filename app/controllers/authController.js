import UserRepository from '../repositories/usersRepository'
import jwtHelper from '../helpers/jwtHelper';

class AuthController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    auth(req, res) {
        const data = req.body;
        if (!isAuthDataValid(data)) {
            return res.send(toErrorResponse(404, 'missing login or password'));
        }

        const user = this.userRepository.findByEmail(data.login);
        if (!user || user.password !== data.password) {
            return res.send(toErrorResponse(404, 'invalid login or password'));
        }

        return res.send(toSuccessResponse(user, jwtHelper.sign(user)));
    }
}

const isAuthDataValid = (data) => data && data.login && data.password;

const toSuccessResponse = (user, token) => {
    return {
        code: 200,
        message: "ok",
        data: {
            user: {
                email: user.email,
                username: user.name
            }
        },
        token: token
    }
};

const toErrorResponse = (code, msg) => {
    return {
        code: code,
        message: msg
    }
};

export default AuthController;