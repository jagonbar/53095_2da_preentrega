import mongoose from mongoose

const cartCollection = 'cart'

const productQuantitySchema = new Schema({
    product: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    products: { type: [productQuantitySchema], required: true },
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export {default as cartModel,productQuantitySchema,cartSchema}