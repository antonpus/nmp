import jwtHelper from './jwtHelper';
import {User} from '../../db/postgres/models';

const authenticateAsync = (login, password) => {
    return new Promise((resolve, reject) => checkMissingCredentials(login, password)
        .then(login => User.findOne({where: {email: login}}))
        .then(validateUserExists)
        .then(user => validatePassword(password, user))
        .then(resolve)
        .catch(reject));
};

const checkMissingCredentials = (login, password) => new Promise(
    (resolve, reject) => (!login || !password) ? reject('Missing login or password') : resolve(login));

const validateUserExists = user => new Promise((resolve, reject) => !user ? reject('Invalid login') : resolve(user));

const validatePassword = (password, user) => new Promise(
    (resolve, reject) => !(user.password === password) ? reject('Invalid password') : resolve(user));

const toSuccessfulAuthResponse = user => {
    return {
        code: 200,
        message: "ok",
        data: {
            user: {
                email: user.email,
                username: user.name
            }
        },
        token: jwtHelper.sign(user)
    }
};

const toFailureAuthResponse = (code, msg) => {
    return {
        code: code,
        message: msg
    }
};

export default {authenticateAsync, toSuccessfulAuthResponse, toFailureAuthResponse};