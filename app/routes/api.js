import express from 'express';
import productsController from '../controllers/productsController';
import usersController from '../controllers/usersController';

const apiRouter = express.Router();

apiRouter.post('/products', productsController.create);
apiRouter.get('/products', productsController.getAll);
apiRouter.get('/products/:id', productsController.getOne);
apiRouter.get('/products/:id/reviews', productsController.getReviews);

apiRouter.post('/users', usersController.create);
apiRouter.get('/users', usersController.getAll);

export default apiRouter;
