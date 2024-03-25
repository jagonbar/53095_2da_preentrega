import { Schema,model } from "mongoose"

const cartCollection = 'cart'

const productQuantitySchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const cartSchema = new Schema({
    products: [{ type: productQuantitySchema }],
})

const cartModel = model(cartCollection, cartSchema)

export {cartModel, productQuantitySchema, cartSchema}