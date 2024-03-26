import { Router }        from "express";
import Validador         from '../util/Validador.js'
import ProductManager    from '../util/ProductManager.js'
import {dataFileProduct} from '../util/filePaths.js'


const pm = new ProductManager(dataFileProduct)

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {

    const retornarPayload =
        (   status
            , payload
            , totalPages
            , page
            , url
            , limit
            , sort
            , query)=>{
                        url += `?limit=${limit}`
                        if(sort!==undefined){
                            url += `&sort=${sort}`
                        }

                        const hasPrevPage = (page>1)
                        const hasNextPage = (page<totalPages)
                        
                        const retorno= {
                            status      //success/error
                            ,payload:payload    // Resultado de los productos solicitados
                            ,totalPages // Total de páginas
                            ,prevPage   :hasPrevPage?page-1:null // Página anterior
                            ,nextPage   :hasNextPage?page+1:null // Página siguiente
                            ,page        // Página actual
                            ,hasPrevPage // Indicador para saber si la página previa existe
                            ,hasNextPage // Indicador para saber si la página siguiente existe.
                            ,prevLink   :hasPrevPage ?`${url}&page=${page-1}`:null // Link directo a la página previa (null si hasPrevPage=false)
                            ,nextLink   :hasNextPage ?`${url}&page=${page+1}`:null // Link directo a la página siguiente (null si hasNextPage=false)
                        }
                        console.log({retorno})
                        return retorno        
                    }

    // const url = `${req.protocol}://${req.get('host')}/${req.url}`;
    const url = `${req.protocol}://${req.get('host')}/api/products/`;
    
    console.log("import.meta.url:",import.meta.url)
    console.log("req.body.query:",req.body.query)
    
    const query   = req.body.query  !==undefined? JSON.parse(req.body.query) : {}
    const sort    = req.query.sort
    let   limit   = req.query.limit !==undefined? parseInt(req.query.limit) : 10  
    let   page    = req.query.page  !==undefined? parseInt(req.query.page)  : 1

    try {

        let countElementos,
            totalPages,
            payload
        
        ({
            countElementos,
            totalPages,
            productos: payload,
            limit,
            page
        } = await pm.getProducts(query, page, limit, sort));


                
        res.status(200).send(
            retornarPayload(   
                "success"
                , payload
                , totalPages
                , page
                , url
                , limit
                , sort
                , query));
    } catch (error) {
        console.error(error);
        
        res.status(500).send(
            retornarPayload(   
                "error"
                , []
                , 0
                , page
                , url
                , limit
                , sort
                , query)
        );

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

        const product = await pm.addProduct(
            title
            , description
            , price
            , thumbnails
            , code
            , stock            
            , category
        )
        console.log("product:", product)
        res.status(200).send(product)
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