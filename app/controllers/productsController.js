import {Product, Review} from '../../db/models'

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

        const reviewPromises = data.reviews
            .map(review => Review.create(review));

        return Product.create(data)
            .then(product => Promise.all(reviewPromises)
                .then(reviews => product.setReviews(reviews))
                .then(() => product)
                .catch(err => throw new Error(err)))
            .then(product => res.status(201).send(product))
            .catch(err => res.status(400).send(err));
    }

    getAll(req, res) {
        return Product.findAll({
            include: [{
                model: Review,
                as: 'reviews',
            }],
        })
            .then(products => res.status(200).send(products))
            .catch(error => res.status(400).send(error));
    }

    getOne(req, res) {
        return Product.findByPk(req.params.id)
            .then(rejectOnMissingProduct)
            .then(product => res.status(200).send(product),
                () => res.status(404).send({'message': 'product not found'}))
            .catch(error => res.status(400).send(error));
    }

    getReviews(req, res) {
        return Product.findByPk(req.params.id, {
            include: [{
                model: Review,
                as: 'reviews',
            }],
        })
            .then(rejectOnMissingProduct)
            .then(product => res.status(200).send(product.reviews),
                () => res.status(404).send({'message': 'product not found'}))
            .catch(error => res.status(400).send(error));
    }
}

const isProductDataValid = data => data && data.name;

const rejectOnMissingProduct = product => new Promise((resolve, reject) => {
    if (!product) {
        reject();
        return;
    }
    resolve(product);
});

const productsController = new ProductsController();

export default productsController;