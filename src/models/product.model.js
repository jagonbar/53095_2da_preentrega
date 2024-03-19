import mongoose from mongoose

const productCollection = 'product'

const productSchema = new mongoose.Schema({
    // id          :0
     title      :String
    ,description:String
    ,price      :Number
    ,thumbnail  :String
    // ,code       :0
    ,stock      :Number
})
const productModel = mongoose.model(productCollection, productSchema)

export {
    default as productModel,
    productSchema
}