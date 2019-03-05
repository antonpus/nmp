import express from 'express';
import productsController from '../controllers/productsController';
import usersController from '../controllers/usersController';

const apiRouter = express.Router();

apiRouter.post('/products', (req, res) => productsController.create(req, res));
apiRouter.get('/products', (req, res) => productsController.getAll(req, res));
apiRouter.get('/products/:id', (req, res) => productsController.getOne(req, res));
apiRouter.get('/products/:id/reviews', (req, res) => productsController.getReviews(req, res));
apiRouter.get('/users', (req, res) => usersController.getAll(req, res));

export default apiRouter;
