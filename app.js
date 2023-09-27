// Importamos los módulos necesarios.
const express = require('express');
const fs = require('fs');
const { productManager, cartManager } = require('./persistance/index');
const productsRoutes = require('./routes/products.routes');
const cartsRoutes = require('./routes/carts.routes');

// Creamos una instancia de Express.
const app = express();
const port = 8080;

// Middleware para permitir el uso de JSON en las solicitudes.
app.use(express.json());

app.use(productsRoutes);
app.use(cartsRoutes);

// Usa las rutas como middleware
// app.use('/', router);

// Iniciamos el servidor en el puerto especificado.
app.listen(port, () => {
    console.log(`Servidor Express iniciado en el puerto ${port}`);
});