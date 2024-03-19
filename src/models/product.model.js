import { Schema,model } from "mongoose"

const productCollection = 'product'

const productSchema = new Schema({
    // id          :0
     title      :String
    ,description:String
    ,price      :Number
    ,thumbnail  :String
    // ,code       :0
    ,stock      :Number
    ,status     :Boolean
    ,category   :String
})
const productModel = model(productCollection, productSchema)

export {
    productModel,
    productSchema
}