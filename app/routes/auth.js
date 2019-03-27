import express from 'express';
import authController from '../controllers/authController';
import passport from '../middlewares/passport';

const authRouter = express.Router();

authRouter.post('/v1', (req, res) => authController.auth(req, res));
authRouter.post('/v2', (req, res, next) => passport.auth(req, res, next));

export default authRouter;
