import jwtHelper from './jwtHelper';
import usersRepository from '../repositories/usersRepository';

const authenticateAsync = (login, password) => {
    return new Promise((resolve, reject) => {
        if (!login || !password) {
            reject('Missing login or password');
        }
        const user = usersRepository.findByEmail(login);
        if (!user) {
            reject('Invalid login');
        }
        if (!isPasswordValid(password, user)) {
            reject('Invalid password');
        }
        resolve(user);
    });
};

const isPasswordValid = (password, user) => user.password === password;

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