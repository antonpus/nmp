import productsRepository from '../repositories/productsRepository'

class ProductsController {
    constructor() {
    }

    create(req, res) {
        const data = req.body;
        if (!isProductDataValid(data)) {
            return res.status(400).send({
                'message': 'invalid request'
            });
        }
        const newProduct = productsRepository.create(req.body);
        return res.status(201).send(newProduct);
    }

    getAll(req, res) {
        const products = productsRepository.findAll();
        return res.status(200).send(products);
    }

    getOne(req, res) {
        const product = productsRepository.find(req.params.id);
        if (!product) {
            return res.status(404).send({
                'message': 'product not found'
            });
        }
        return res.status(200).send(product);
    }

    getReviews(req, res) {
        const product = productsRepository.find(req.params.id);
        if (!product) {
            return res.status(404).send({
                'message': 'product not found'
            });
        }
        return res.status(200).send(product.reviews);
    }
}

const isProductDataValid = data => data && data.id && data.name;

const productsController = new ProductsController();

export default productsController;