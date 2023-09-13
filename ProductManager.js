// Importamos el módulo 'fs' (File System) para trabajar con archivos en el sistema de archivos.
const fs = require('fs');

// Definimos la clase ProductManager.
class ProductManager {
    // El constructor recibe el filePath, que es la ruta al archivo donde se almacenarán los productos.
    constructor(filePath) {
        this.path = filePath; // Almacenamos la ruta en la propiedad 'path'.
    }

    // Método para agregar un producto.
    addProduct(product) {
        // Obtenemos la lista de productos existente.
        const products = this.getProducts();
        
        // Verificamos si ya existe un producto con el mismo código.
        const existingProduct = products.find(p => p.code === product.code);
        if (existingProduct) {
            throw new Error('Ya existe un producto con el mismo código.');
        }
    
        // Encontramos el id más alto entre los productos actuales.
        const highestId = products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
        
        // Creamos un nuevo producto basado en el producto proporcionado, con un id único.
        const newProduct = {id: highestId + 1, ...product};
        
        // Agregamos el nuevo producto a la lista de productos.
        products.push(newProduct);
        
        // Guardamos la lista actualizada de productos en el archivo.
        this.saveProducts(products);
        
        // Devolvemos el nuevo producto agregado.
        return newProduct;
    }

    // Método para obtener la lista de productos.
    getProducts() {
        try {
            // Leemos el contenido del archivo en 'utf-8' y lo interpretamos como JSON.
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data); // Devolvemos la lista de productos.
        } catch (error) {
            return []; // Si ocurre un error (por ejemplo, el archivo no existe), devolvemos una lista vacía.
        }
    }

    // Método para obtener un producto por su id.
    getProductById(id) {
        const products = this.getProducts();
        // Buscamos un producto en la lista con el id proporcionado.
        return products.find(product => product.id === id);
    }

    // Método para actualizar un producto por su id con los campos actualizados.
    updateProduct(id, updatedFields) {
        const products = this.getProducts();
        // Encontramos el índice del producto con el id proporcionado en la lista.
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            // Actualizamos los campos del producto en la lista.
            products[productIndex] = { ...products[productIndex], ...updatedFields };
            // Guardamos la lista actualizada de productos en el archivo.
            this.saveProducts(products);
            // Devolvemos el producto actualizado.
            return products[productIndex];
        }
        return null; // Si no se encuentra el producto, devolvemos null.
    }

    // Método para eliminar un producto por su id.
    deleteProduct(id) {
        const products = this.getProducts();
        // Filtramos los productos para obtener una nueva lista sin el producto con el id proporcionado.
        const filteredProducts = products.filter(product => product.id !== id);
        // Guardamos la lista filtrada de productos en el archivo.
        this.saveProducts(filteredProducts);
        // Devolvemos la lista de productos filtrada.
        return filteredProducts;
    }

    // Método para guardar la lista de productos en el archivo.
    saveProducts(products) {
        // Escribimos la lista de productos en el archivo en formato JSON con formato legible.
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2), 'utf-8');
    }
}

// Exportamos la clase ProductManager para poder usarla en otros archivos.
module.exports = ProductManager;