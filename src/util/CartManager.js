import { cartModel } from "../models/cart.model.js";

/**
 * Clase para gestionar carritos
 */
export default class CartManager {

    /**
     * Constructor de la clase CartManager
     * @param {string} path - Ruta del archivo donde se almacenarán los carritos
     */
    constructor() {
        
    } 
    /**
     * Crea un nuevo carrito y lo añade al array de carritos
     * @returns {Number} Retorna el ID del carrito creado
     */
    async createCart() {
        const newCart = {
            products: []
        }
        
        const cart = await cartModel.create(newCart)
        
        return cart
    }

    /**
     * Obtiene un carrito por su ID
     * @param {Number} cid - ID del carrito
     * @returns {Object} Retorna el carrito si se encuentra, sino undefined
     */
    async getCartById(cid) {
        
        
        console.log('getCartById buscando id:', cid)
        
        const cart = await cartModel.findOne({_id: cid})

        if (!cart) { console.log("Not found1"); return false; }
        
        await cart.populate('products.product')

        return cart
    }

    /**
     * Añade un producto a un carrito
     * @param {Number} cid - ID del carrito
     * @param {Number} pid - ID del producto
     * @returns {Boolean} Retorna true si el producto es añadido con éxito
     */
    async addProductToCart(cid, pid, quantity, incrementar=false) {
        cid = parseInt(cid) 
        pid = parseInt(pid)
        console.log("cid,pid",{cid,pid})
        
        const cart = await this.getCartById(cid)
        console.log("cart",{cart})
        if(!cart) {
            return {ok:false, quantity:0}
        }
        
        // Encontrar el índice del producto dentro del array de productos del carrito
        const productIndex = cart.products.findIndex(p => p.product === pid);

        if (productIndex !== -1) {            
            // Incrementar la cantidad del producto cuando se hace post
            quantity = incrementar ? cart.products[productIndex].quantity + quantity : quantity;
            cart.products[productIndex].quantity = quantity
        } else {
            // Agregar el producto al carrito con cantidad de 1
            cart.products.push({ product: pid, quantity: quantity });            
        }
        await cart.save();
                                    
        return {ok:true, quantity:quantity}
    }
    
    /**
     * DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
     * Elimina un producto del carrito por su ID.
     * @param {number} cid - El ID del carrito del que se eliminará el producto.
     * @param {number} pid - El ID del producto que se eliminará del carrito.
     * @returns {boolean} - Devuelve true si se eliminó el producto correctamente, de lo contrario false.
     */
    async deleteProductFromCart(cid, pid) {
        cid = parseInt(cid) 
        pid = parseInt(pid)
        const cart = await this.getCartById(cid)
        if(!cart) return false
        const productIndex = cart.products.findIndex(p => p.product === pid);
        if (productIndex === -1) return false
        cart.products.splice(productIndex, 1);
        await cart.save();
        return true
    }
    
    /**
     * PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
     * Actualiza el carrito con un arreglo de productos.
     * @param {number} cid - El ID del carrito que se actualizará.
     * @param {Array} products - Un arreglo de productos con el formato especificado.
     * @returns {boolean} - Devuelve true si se actualizó el carrito correctamente, de lo contrario false.
     */
    async updateCart(cid, products) {
        cid = parseInt(cid) 
        const cart = await this.getCartById(cid)
        if(!cart) return false
        cart.products = products
        await cart.save();
        return true
    }    
    
    /**
     * DELETE api/carts/:cid deberá eliminar todos los productos del carrito 
     * Elimina todos los productos del carrito.
     * @param {number} cid - El ID del carrito del que se eliminarán todos los productos.
     * @returns {boolean} - Devuelve true si se eliminaron todos los productos correctamente, de lo contrario false.
     */
    async deleteAllProductsFromCart(cid) {
        cid = parseInt(cid) 
        const cart = await this.getCartById(cid)
        if(!cart) return false
        cart.products = []
        await cart.save();
        return true
    }
}

