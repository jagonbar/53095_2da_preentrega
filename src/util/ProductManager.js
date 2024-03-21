import {productModel} from '../models/product.model.js'

export default class ProductManager {

    constructor() {        
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
        
        // const idIncremental = this.products.length + 1
        const thumbnails = thumbnail ? thumbnail : []
        const newProduct = {
            // id: idIncremental,
            title,
            description,
            price,
            thumbnail: thumbnails,
            code,
            stock,
            status: true,
            category
        }
        const product = await productModel.create(newProduct)
        return product
    }
    async getProducts(query, page, limit, sortOrder) {
        
        const countElementos = await YourModel.countDocuments(query);
        
        const offset = (page - 1) * limit

        const totalPages = countElementos>0 ? Math.ceil(countElementos / limit) : 0
                           console.log("countElementos:", countElementos);

        const elementos = (countElementos>0)? 
            await productModel
                .find(query)
                .sort({ title: sortOrder })
                .skip(offset)
                .limit(limit)
            : []

        return {
            countElementos,
            totalPages,
            elementos
        }
    }
    async getProductById(id) {
        console.log('getProductById buscando id:', id)
        
        const product = await productModel.findOne({_id: id})

        if (!product) { console.log("No encontrado1"); return false; }
        
                
        return product
    }

    //06 Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID
    async updateProduct(id, title, description, price, thumbnail, code, stock, status, category) {
        const product = await this.getProductById(id)
        if (!product) {
            console.log("No encontrado");
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
        const result = await productModel.updateOne({_id: id}, {$set: product})
        return (result.ok==1)
    }
    //07 Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el Archivo
    async deleteProduct(id) {
        
        const product = await this.getProductById(id)
        if (!product) {
            console.log("No encontrado");
            return false;
        }
        
        const result = await productModel.deleteOne({_id: id})
        return result.ok==1
        
    }
}