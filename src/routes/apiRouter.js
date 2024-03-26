import { Router }     from "express";
import productsRouter from "./productsRouter.js";
import cartsRouter    from "./cartRouter.js";
import fs             from 'fs'
import path           from 'path'
import { __dirname }  from "../path.js";
import { MongoClient } from 'mongodb';

const apiRouter = Router();

apiRouter.use('/products',productsRouter)
apiRouter.use('/carts',cartsRouter)
apiRouter.get('/carga',async (req,res)=>{
    //leer de data el archivo ProductList.json con filesystem y cargarlo en la base de datos
    const url = 'mongodb+srv://admin:.1.2.3.4.5.6.@cluster0.xinylg0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

    // Nombre de la base de datos y la colección donde se guardarán los productos    
    const client = await MongoClient.connect(url);
    const db = client.db("test");

    let jsonFilePath = path.join(__dirname,'../data/ProductList.json')
    console.log("jsonFilePath:",{jsonFilePath})
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const data = JSON.parse(jsonData);
    const productsCollection = db.collection("products");
    // Eliminar todos los documentos existentes en la colección
    await productsCollection.deleteMany({});

    // Insertar los nuevos documentos en la colección
    await productsCollection.insertMany(data);
    
    // Cerrar la conexión a la base de datos
    client.close();
    
    res.send("cargados los productos")

})
export default apiRouter