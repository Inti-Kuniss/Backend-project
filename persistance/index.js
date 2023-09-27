const ProductManager = require('../controllers/ProductManager');
const CartManager = require('../controllers/CartManager');

// Creamos una instancia de ProductManager con la ruta al archivo de productos.
const productManager = new ProductManager('./persistance/files/products.json');

// Creamos una instancia de CartManager con la ruta al archivo de productos.
const cartManager = new CartManager('./persistance/files/carts.json');

module.exports = { productManager, cartManager };