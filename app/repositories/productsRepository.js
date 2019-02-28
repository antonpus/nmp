import Product from '../models/product'
import Review from '../models/review'

class ProductsRepository {
    constructor() {
        this.products = [];
    }

    create(data) {
        const reviews = data.reviews ? data.reviews.map(r => new Review(r.rate, r.comment)) : [];
        const product = new Product(data.id, data.name, reviews);
        this.products.push(product);
        return product;
    }

    find(id) {
        return this.products.find(prd => prd.id === id);
    }

    findAll() {
        return this.products;
    }
}

export default ProductsRepository;