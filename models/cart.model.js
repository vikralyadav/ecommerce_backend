const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', 
                required: true
            },
            name: {
                type: String, 
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1 
            },
            price: {
                type: Number, 
                required: true
            },
            total: {
                type: Number, 
                required: true,
                default: 0
            }
        }
    ],
    totalItems: {
        type: Number,
        required: true,
        default: 0 
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

cartSchema.statics.clearCart = async function () {
    return this.updateOne(
        { },
        { $set: { items: [], totalItems: 0, totalPrice: 0 } },
        { new: true }
    );
};

cartSchema.statics.removeItem = async function (productId) {
    const cart = await this.findOne();
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    return cart;
};

module.exports = mongoose.model('cart', cartSchema)