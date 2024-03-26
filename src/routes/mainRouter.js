import { Router }        from "express"
import ProductManager    from '../util/ProductManager.js'
import {dataFileProduct} from '../util/filePaths.js'
import apiRouter         from './apiRouter.js'


const mainRouter = Router();
const pm = new ProductManager(dataFileProduct)
mainRouter.use('/api',apiRouter)

mainRouter.get('/', (req, res)=>{
    res.render('home', {
    //   css: 'main.css',
    //   js: 'main.js'  
    jsScripts:[
        {js: 'socketClient.js'},
    ]
    })
})

mainRouter.get('/realtimeproducts', async (req, res) => {
    let response, hayProductos
    let publicdir = req.publicdir
    console.log("publicdir:",publicdir)
    try {
        
        response = await pm.getProducts();                
        hayProductos = (response.length>0)
        // res.status(200).send(response);
    } catch (error) {
        console.error(error);
        // res.status(500).send("error_al_listar_productos");
    }
    res.render('realtimeproducts', {
        cssScripts: [
            {
                css: '/public/css/alert-pop.css'             
            }
        ],
        jsScripts:[
            {
                js: '/public/js/realtimeproducts.js'
            }
        ],
        hayProductos:hayProductos,
        products:response,

    })

})
mainRouter.get('/products', async (req, res) => {
    let response, hayProductos

    const query   = req.body.query!==undefined ? JSON.parse(req.body.query) : {}
    const limit   = req.query.limit ?? 10  
    const page    = req.query.page  ?? 1
    const sort    = req.query.sort

    try {
        
        let {countElementos, totalPages, elementos} = await pm.getProducts(query, page, limit, sort);

        console.log("response getProducts:",{response})
        
        hayProductos = (countElementos>0)
        
        res.render('products', {
            // css: 'main.css',
            // js: 'main.js',
            hayProductos:hayProductos,
            products: elementos,    
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).send("error_al_listar_productos");
    }
    
})


export default mainRouter