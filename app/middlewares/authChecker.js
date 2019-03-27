import jwtHelper from '../helpers/jwtHelper';

const authChecker = (req, res, next) => {
    jwtHelper.verify(req.headers['jwt-token'], () => next(), () => sendAuthError(res));
};

const sendAuthError = res => {
    res.status(401).send({
        message: 'Missing authentication'
    })
};

export default authChecker;