import { Router }     from "express";
import Validador      from '../util/Validador.js'
import ProductManager from '../util/ProductManager.js'
import CartManager    from "../util/CartManager.js";
import {dataFileCart, dataFileProduct} from '../util/filePaths.js'

const cm = new CartManager(dataFileCart)
const pm = new ProductManager(dataFileProduct)

const cartsRouter = Router();
/*************************************************************************************************** */
/**
 * CARRITO
 * Para el carrito, el cual tendrá su router en /api/carts/, configurar dos rutas
 */

/**
 * La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
Id      : Number/String 
        (A tu elección, de igual manera como con los productos, 
        debes asegurar que nunca se dupliquen los ids y que este se autogenere).
products: Array que contendrá objetos que representen cada producto
 */
cartsRouter.post('/', async (req, res) => {
    try {
        const r = await cm.createCart()
        
        res.status(200).send(r.toString())
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear el carrito");
    }
})
/**
 * La ruta GET /:cid deberá listar los productos que pertenezcan 
 * al carrito con el parámetro cid proporcionados.
 */
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        // if( cid==0){
        //     console.log("todos")
        //     const carts = await cm.readFile()
        //     return res.status(200).send(carts);
        // }
        const cart = await cm.getCartById(cid)
        if(!cart){
            return res.status(404).send(`El carrito no se encuentra`);
        }
                
        res.status(200).send(cart.products)

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener el carrito");
    }
})
/**
 * La ruta DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
 */
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        //TODO validar que sean numeros
        const r = await cm.deleteProductFromCart(cid, pid)
        if(!r){
            return res.status(404).send(`El carrito no se encuentra`);
        }
        res.status(200).send(r)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al intetando borrar el producto");
    }
})
/**
 * La ruta PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
 */
cartsRouter.put('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const { products } = req.body
        const r = await cm.updateCart(cid, products)
        if(!r){
            return res.status(404).send(`El carrito no se encuentra`);
        }
        res.status(200).send(r)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar el carrito");
    }
})

/**
 * La ruta PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
 */
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        const { quantity } = req.body
        const {ok, quantity:quantityAsignada} = await cm.addProductToCart(cid, pid, quantity, false)
        if(ok){
            return res.status(404).send(`El carrito no se encuentra`);
        }
        res.status(200).send(r)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar el carrito");
    }
})
/**
 * La ruta DELETE api/carts/:cid deberá eliminar todos los productos del carrito 
 */
cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const r = await cm.deleteAllProductsFromCart(cid)
        if(!r){
            return res.status(404).send(`El carrito no se encuentra`);
        }
        res.status(200).send(r)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al borrar el carrito");
    }
})
/**
 * La ruta POST  /:cid/product/:pid deberá agregar el producto 
 * al arreglo "products" del carrito seleccionado, 
 * agregándose como un objeto bajo el siguiente formato:
 * - product : SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
 * - quantity: debe contener el número de ejemplares de dicho producto. 
 *             El producto, de momento, se agregará de uno en uno.
 * Además, si un producto ya existente intenta agregarse al producto, 
 * incrementar el campo quantity de dicho producto.
 */
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        
        if(!pm.getProductById(pid)){
            return res.status(404).send(`El producto no se encuentra`);
        }

        const cid = req.params.cid
        if(!cm.getCartById(cid)){
            return res.status(404).send(`El carrito no se encuentra`);
        }
        
        const {ok, quantity} = await cm.addProductToCart(cid, pid, 1, true)

        if(ok){
            res.status(200).send(`cantidadAsignada: ${quantity}`)
        }else{
            res.status(404).send(`El carrito no se encuentra`);
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al agregar el producto");
    }
})
// cartsRouter.get('/list', async (req, res) => {
//     try {
//         const r = await cm.readFile()
        
//         res.status(200).send(r)
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("No se pudo leer el archivo de carritos");
//     }
// })
export default cartsRouter