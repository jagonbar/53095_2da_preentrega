import { Router }     from "express";
import productsRouter from "./productsRouter.js";
import cartsRouter from "./cartRouter.js";

const apiRouter = Router();

apiRouter.use('/products',productsRouter)
apiRouter.use('/carts',cartsRouter)

export default apiRouter