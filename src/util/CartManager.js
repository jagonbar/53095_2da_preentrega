import fs from 'fs'

/**
 * Clase para gestionar carritos
 */
export default class CartManager {

    /**
     * Constructor de la clase CartManager
     * @param {string} path - Ruta del archivo donde se almacenarán los carritos
     */
    constructor(path) {
        this.carts = []
        this.path = path
    }

    /**
     * Lee el archivo de carritos desde el sistema de archivos
     * @returns {Array} Retorna un array de carritos si el archivo existe, sino false
     */
    async readFile() {
        let carts = await fs.promises.readFile(this.path, 'utf-8') ?? false;
        if (!carts) return false;
        carts = JSON.parse(carts);
        this.carts = carts
        return this.carts
    }

    /**
     * Escribe el array de carritos en el sistema de archivos
     */
    async writeFile() {
        const data = JSON.stringify(this.carts);
        await fs.promises.writeFile(this.path, data)
    }   
    /**
     * Crea un nuevo carrito y lo añade al array de carritos
     * @returns {Number} Retorna el ID del carrito creado
     */
    async createCart() {
        let carts = await this.readFile()
        this.carts = carts ?? [];
        const idIncremental = this.carts.length + 1
        const newCart = {
            id: idIncremental,
            products: []
        }
        this.carts.push(newCart)
        await this.writeFile()
        return idIncremental
    }

    /**
     * Obtiene un carrito por su ID
     * @param {Number} cid - ID del carrito
     * @returns {Object} Retorna el carrito si se encuentra, sino undefined
     */
    async getCartById(cid) {
        await this.readFile()
        const cart = this.carts.find(cart => parseInt(cart.id) === parseInt(cid))
        
        if(!cart){ return false}
        
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

