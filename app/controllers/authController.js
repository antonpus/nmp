import authHelper from '../helpers/authHelper';

class AuthController {
    constructor() {
    }

    auth(req, res) {
        const {login, password} = req.body;
        authHelper.authenticateAsync(login, password)
            .then(user => res.send(authHelper.toSuccessfulAuthResponse(user)),
                err => res.send(authHelper.toFailureAuthResponse(401, err)))
            .catch(err => res.send(authHelper.toFailureAuthResponse(500, err)));
    }
}

const authController = new AuthController();

export default authController;