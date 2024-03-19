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
        
        
        console.log('getCartById buscando id:', id)
        
        const cart = await cartModel.findOne({_id: id})

        if (!cart) { console.log("Not found1"); return false; }
                        
        return cart
    }

    /**
     * Añade un producto a un carrito
     * @param {Number} cid - ID del carrito
     * @param {Number} pid - ID del producto
     * @returns {Boolean} Retorna true si el producto es añadido con éxito
     */
    async addProductToCart(cid, pid) {
        cid = parseInt(cid) 
        pid = parseInt(pid)
        console.log("cid,pid",{cid,pid})
        let cantidadAsignada =1

        const cart = await this.getCartById(cid)
        console.log("cart",{cart})
        if(!cart) {
            return false
        }
        
                    
        this.carts = this.carts.map(c => {
            console.log(`map de carts c.id:${c.id} `)
            if(parseInt(c.id) === parseInt(cid))
            {
                console.log(`encontrado carro `)
                if(c.products.length>0)
                {
                    console.log(`hay productos`)
                    let encontrado = false
                    let products = c.products.map(p=>{
                        if(parseInt(p.product) === parseInt(pid)){
                            p.quantity++
                            cantidadAsignada= p.quantity
                            encontrado = true
                        }
                        return p
                    })
                    products =(!encontrado) ? [...products,{product:pid, quantity:1}] : products
                    return {...c, products: products}                                        
                }//end if length
                return {...c, products: [{product:pid, quantity:1}]}
            }//end if id
            return c
        })//endmap
                            
        await this.writeFile()
        return cantidadAsignada
    }
}

