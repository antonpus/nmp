import jwt from 'jsonwebtoken';
import config from '../../config/config';

const sign = user => jwt.sign({sub: user.email}, config.auth.secret);

const verify = (token, done, failed) => jwt.verify(token, config.auth.secret, err => {
    if (err) {
        failed();
    } else {
        done();
    }
});

export default {sign, verify};