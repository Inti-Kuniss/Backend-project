// Importamos el módulo 'fs' (File System) para trabajar con archivos en el sistema de archivos.
const fs = require('fs');

// Definimos la clase ProductManager.
class CartManager {
    // El constructor recibe el filePath, que es la ruta al archivo donde se almacenarán los productos.
    constructor(filePath) {
        this.path = filePath; // Almacenamos la ruta en la propiedad 'path'.
    }

    // Función para guardar los carritos en el archivo "carts.json".
    addCart(cart) {
        fs.writeFileSync(this.path, JSON.stringify(cart, null, 2), 'utf-8');
    }

    // Función para obtener los carritos desde el archivo "carts.json".
    getCarts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    // Función para generar un ID único.
    generateUniqueId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
// Exportamos la clase ProductManager para poder usarla en otros archivos.
module.exports = CartManager;