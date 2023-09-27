// Importamos los módulos necesarios.
const express = require('express');
const fs = require('fs');
const { productManager, cartManager } = require('./persistance/index');
const productsRoutes = require('./routes/products.routes');
const cartsRoutes = require('./routes/carts.routes');
const viewsRoutes = require('./routes/views.routes');

// Creamos una instancia de Express.
const app = express();
const port = 8080;

const { engine } = require ('express-handlebars');

app.set('view engine', 'hbs');

app.engine('hbs', engine({
	layoutsDir: `./views/layouts`,
    extname: 'hbs',
    defaultLayout: 'index'	
}));

// Middleware para permitir el uso de JSON en las solicitudes.
app.use(express.json());

app.use(express.static('public'));

app.use(productsRoutes);
app.use(cartsRoutes);
app.use(viewsRoutes);

// Iniciamos el servidor en el puerto especificado.
app.listen(port, () => {
    console.log(`Servidor Express iniciado en el puerto ${port}`);
});