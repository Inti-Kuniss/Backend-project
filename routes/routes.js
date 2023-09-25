const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const CartManager = require('../CartManager');

// Creamos una instancia de ProductManager con la ruta al archivo de productos.
const productManager = new ProductManager('products.json');

// Creamos una instancia de CartManager con la ruta al archivo de productos.
const cartManager = new CartManager('carts.json');

// Ruta para obtener todos los productos o un número limitado de productos.
router.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit));
            res.json(limitedProducts);
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para obtener un producto por su id.
router.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Ruta para agregar un nuevo producto.
router.post('/products', async (req, res) => {
    try {
        const newProduct = req.body;
        const addedProduct = await productManager.addProduct(newProduct);
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para actualizar un producto por su id.
router.put('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body;
        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para eliminar un producto por su id.
router.delete('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const products = await productManager.deleteProduct(productId);
        res.json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para crear un nuevo carrito.
router.post('/carts', (req, res) => {
    try {
        // Generar un ID único para el carrito
        const cartId = cartManager.generateUniqueId();
        
        // Crear un carrito vacío.
        const cart = {
            id: cartId,
            products: []
        };
        
        // Guardar el carrito en el archivo "carts.json".
        const carts = cartManager.getCarts();
        carts.push(cart);
        cartManager.addCart(carts);
        
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Ruta para listar los productos en un carrito por su ID de carrito (cid).
router.get('/carts/:cid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const carts = cartManager.getCarts();
        const cart = carts.find(c => c.id === cartId);
        
        if (cart) {
            res.json(cart.products);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Ruta para agregar un producto a un carrito por su ID de carrito (cid) y ID de producto (pid).
router.post('/carts/:cid/product/:pid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1; // Default a 1 si no se proporciona.
        
        const carts = cartManager.getCarts();
        const cart = carts.find(c => c.id === cartId);
        
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }
        
        const product = productManager.getProductById(productId);
        
        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        
        // Buscar si el producto ya existe en el carrito.
        const existingProduct = cart.products.find(p => p.id === productId);
        
        if (existingProduct) {
            // Si el producto ya está en el carrito, incrementar la cantidad.
            existingProduct.quantity += quantity;
        } else {
            // Si el producto no está en el carrito, agregarlo.
            cart.products.push({ id: productId, quantity });
        }
        
        // Guardar el carrito actualizado en el archivo.
        cartManager.addCart(carts);
        
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

module.exports = router;