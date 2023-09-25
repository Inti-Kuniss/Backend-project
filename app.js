// Importamos los módulos necesarios.
const express = require('express');
const ProductManager = require('./controllers/ProductManager');
const CartManager = require('./controllers/CartManager');
const fs = require('fs');

// Creamos una instancia de Express.
const app = express();
const port = 8080;

// Middleware para permitir el uso de JSON en las solicitudes.
app.use(express.json());

// Importa las rutas desde el archivo "routes.js"
const routes = require('./routes/routes');

// Usa las rutas como middleware
app.use('/', routes);

// Creamos una instancia de ProductManager con la ruta al archivo de productos.
const productManager = new ProductManager('./models/products.json');

// Creamos una instancia de CartManager con la ruta al archivo de productos.
const cartManager = new CartManager('./models/carts.json');

// Iniciamos el servidor en el puerto especificado.
app.listen(port, () => {
    console.log(`Servidor Express iniciado en el puerto ${port}`);
});