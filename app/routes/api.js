import express from 'express';
import productsController from '../controllers/productsController';
import usersController from '../controllers/usersController';
import citiesController from '../controllers/citiesController';


const apiRouter = express.Router();

apiRouter.post('/products', productsController.create);
apiRouter.get('/products', productsController.getAll);
apiRouter.get('/products/:id', productsController.getOne);
apiRouter.get('/products/:id/reviews', productsController.getReviews);

apiRouter.post('/users', usersController.create);
apiRouter.get('/users', usersController.getAll);

apiRouter.get('/cities', citiesController.getAll);
apiRouter.post('/cities', citiesController.create);
apiRouter.put('/cities/:id', citiesController.update);
apiRouter.delete('/cities/:id', citiesController.remove);

export default apiRouter;
