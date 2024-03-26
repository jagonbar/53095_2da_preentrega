import { Schema,model } from "mongoose"

const productCollection = 'product'

const productSchema = new Schema({
    // id          :0
    item        :Number
    ,title      :String
    ,description:String
    ,price      :Number
    ,thumbnail  :String    
    ,category   :String
    ,stock      :Number
    ,status     :Boolean
})
const productModel = model(productCollection, productSchema)

export {
    productModel,
    productSchema
}