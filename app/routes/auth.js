import express from 'express';
import AuthController from '../controllers/authController';

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/', (req, res) => authController.auth(req, res));

export default authRouter;
