const express = require('express');
const router = express.Router();
const { cartManager, productManager } = require('../persistance/index');

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