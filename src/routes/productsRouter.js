import { Router }        from "express";
import Validador         from '../util/Validador.js'
import ProductManager    from '../util/ProductManager.js'
import {dataFileProduct} from '../util/filePaths.js'


const pm = new ProductManager(dataFileProduct)

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {

    try {
        // console.log("--CWD--",process.cwd())
        // console.log("--data--", dataFileProduct )
        let response = await pm.getProducts();
        // console.log("productos:", { response });
        if (req.query.limit) {
            const limit = req.query.limit;
            if (!Validador.validarNumero(limit)) return res.status(400).send("El limite debe ser un numero");
            if (!Validador.validarNumero(limit, 1)) return res.status(400).send("El limite debe partir desde 1");
            if (!Validador.validarNumeroEntero(limit)) return res.status(400).send("El limite debe ser número entero");

            response = response.slice(0, limit);
        }
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("error_al_listar_productos");
    }
})
/*************************************************************************************************** */
// La ruta GET /:pid deberá traer sólo el producto con el id proporcionado
productsRouter.get('/:pid', async (req, res) => {
    try {
        let pid = req.params.pid
        console.log("pid:", { pid })
        if (!Validador.validarNumero(pid)) return res.status(400).send("El id de producto debe ser un numero")
        if (!Validador.validarNumero(pid, 1)) return res.status(400).send("El id de producto debe partir desde 1")
        if (!Validador.validarNumeroEntero(pid)) return res.status(400).send("El id de producto debe ser número entero")
        pid = parseInt(pid)
        const response = await pm.getProductById(pid)
        if (!response) {
            return res.status(404).send(`El producto no se encuentra`);
        }

        return res.status(200).send(response)
    } catch (error) {
        console.error(error);
        res.status(500).send("error_al_listar_productos");
    }
})
/**
 * La ruta raíz POST / deberá agregar un nuevo producto con los campos:
id: Number/String (A tu elección, el id NO se manda desde body, 
    se autogenera como lo hemos visto desde los primeros entregables, 
    asegurando que NUNCA se repetirán los ids en el archivo.
title:String,
description:String
code:String
price:Number
status:Boolean
stock:Number
category:String
thumbnails:Array de Strings que contengan las rutas donde 
están almacenadas las imágenes referentes a dicho producto
*/

productsRouter.post('/', async (req, res) => {
    try {
        // console.log("body:", req.body)
        const { title
            , description
            , code
            , price
            , stock
            , category
            , thumbnails 
        } = req.body

        const idProduct = await pm.addProduct(
            title
            , description
            , price
            , thumbnails
            , code
            , stock            
            , category
        )
        console.log("idProduct:", idProduct)
        res.status(200).send(idProduct.toString())
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error al agregar el producto");
    }
})
/**
 * La ruta PUT /:pid deberá tomar un producto y actualizarlo por los 
 * campos enviados desde body. NUNCA se debe actualizar 
 * o eliminar el id al momento de hacer dicha actualización.
*/
productsRouter.put('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const { title, description, price, thumbnail, code, stock, status, category } = req.body
        const r = await pm.updateProduct(id, title, description, price, thumbnail, code, stock, status, category)
        if(!r) return res.status(404).send(`El producto no se encuentra`);
        res.status(200).send(r)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar el producto");
    }
})
/**
 * La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 
 */
productsRouter.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const r = await pm.deleteProduct(pid)
        if(!r) return res.status(404).send(`El producto no se encuentra`);
        res.status(200).send(r)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar el producto");
    }
})

export default productsRouter