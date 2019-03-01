import express from 'express';
import ProductsController from '../controllers/productsController';
import UsersController from '../controllers/usersController';

const productController = new ProductsController();
const usersController = new UsersController();

const apiRouter = express.Router();

apiRouter.post('/products', (req, res) => productController.create(req, res));
apiRouter.get('/products', (req, res) => productController.getAll(req, res));
apiRouter.get('/products/:id', (req, res) => productController.getOne(req, res));
apiRouter.get('/products/:id/reviews', (req, res) => productController.getReviews(req, res));
apiRouter.get('/users', (req, res) => usersController.getAll(req, res));

export default apiRouter;
