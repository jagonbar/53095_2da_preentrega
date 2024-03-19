// const fs = require('fs');
import fs from 'fs'

export default class ProductManager {

    constructor(path) {
        this.products = []
        this.path = path;
    }
    async readFile() {
        let products = await fs.promises.readFile(this.path, 'utf-8') ?? false;
        if (!products) return false;
        products = JSON.parse(products);
        this.products = products.map((p) => {
            return { ...p, toString: () => (`id:${p.id} , title:${p.title} , description:${p.description} , price:${p.price} , thumbnail:${JSON.stringify(p.thumbnail)} , code:${p.code} , stock:${p.stock}, status:${p.status}, category:${p.category}`) }
        });
        return this.products
    }
    async writeFile() {


        // let debug= this.products
        // console.log({ debug })

        // const data = JSON.stringify(this.products, replacer);
        const data = JSON.stringify(this.products);
        // console.log({data})
        await fs.promises.writeFile(this.path, data)
    }
    
    /**
    * Agrega un nuevo producto
    *  método addProduct el cual debe recibir un objeto 
    * con el formato previamente especificado, 
    * asignarle un id autoincrementable y guardarlo en el arreglo 
    * (recuerda siempre guardarlo como un array en el archivo).
    * 
    * @param {string} title - El título del producto
    * @param {string} description - La descripción del producto
    * @param {number} price - El precio del producto
    * @param {string} thumbnail - El thumbnail del producto
    * @param {string} code - El código del producto
    * @param {number} stock - El stock del producto
    * @param {string} category - La categoría del producto
    * @returns {number} El id asignado al producto
    * @throws {false} Si faltan campos obligatorios
    * @async
    */
    async addProduct(title, description, price, thumbnail, code, stock, category) {
        if (!(title || description || price || code || stock || category)) {
            console.log("title:",title )
            console.log("description:",description )
            console.log("price:",price )
            console.log("code:",code )
            console.log("stock:",stock )
            console.log("category:",category)

            console.log(`Los siguientes campos son obligatorios:
            title
            description
            price            
            code
            stock
            category`);
            return false;
        }
        let products = await this.readFile()
        this.products = products ?? [];

        const idIncremental = this.products.length + 1
        const thumbnails = thumbnail ? thumbnail : []
        const newProduct = {
            id: idIncremental,
            title,
            description,
            price,
            thumbnail: thumbnails,
            code,
            stock,
            status: true,
            category
        }
        this.products.push(newProduct);

        await this.writeFile()
        return idIncremental;
    }
    async getProducts() {
        return await this.readFile() ?? []
    }
    async getProductById(id) {
        console.log('getProductById buscando id:', id)
        let products = await this.readFile()
        if (!products) { console.log("Not found1"); return false; }
        console.log('getProductById')
        
        this.products = products
        const product = this.products.find(product => parseInt(product.id) === parseInt(id) || product.id === id)
        if (!product) {
            console.log("Not found2");
            return false;
        }
        return product
    }

    //06 Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID
    async updateProduct(id, title, description, price, thumbnail, code, stock, status, category) {
        const product = await this.getProductById(id)
        if (!product) {
            console.log("Not found");
            return false;
        }
        if (title) {
            product.title = title
        }
        if (description) {
            product.description = description
        }
        if (price) {
            product.price = price
        }
        if (thumbnail) {
            product.thumbnail = thumbnail
        }
        if (code) {
            product.code = code
        }
        if (stock) {
            product.stock = stock
        }
        if (status) {
            product.status = status
        }
        if (category) {
            product.category = category
        }
        this.products = this.products.filter(product => product.id !== id)
        this.products.push(product)

        await this.writeFile()
        return true
    }
    //07 Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el Archivo
    async deleteProduct(id) {
        
        const product = await this.getProductById(id)
        if (!product) {
            console.log("Not found");
            return false;
        }
        
        this.products = this.products.filter(product => parseInt(product.id) !== parseInt(id))
        
        await this.writeFile()
        console.log(`Producto id ${product.id} borrado. `);
        return true;
    }
}