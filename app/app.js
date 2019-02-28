import express from 'express';
import cookieParser from 'cookie-parser';
import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';
import ProductsController from './controllers/productsController';
import UsersController from './controllers/usersController';

const app = express();
const productController = new ProductsController();
const usersController = new UsersController();

app.use(cookieParser(), customCookieParser, customQueryParser, express.json());

app.post('/api/products', (req, res) => productController.create(req, res));
app.get('/api/products', (req, res) => productController.getAll(req, res));
app.get('/api/products/:id', (req, res) => productController.getOne(req, res));
app.get('/api/products/:id/reviews', (req, res) => productController.getReviews(req, res));
app.get('/api/users', (req, res) => usersController.getAll(req, res));

export default app;