const cartModel = require('../models/cart.model');



const addToCart = async (req, res) => {
    try {
        const { productId, name, quantity, price } = req.body;

        if (!productId || !name || !quantity || !price) {
            return res.status(400).json({ message: 'All fields are required (productId, name, quantity, price).' });
        }

        let cart = await cartModel.findOne();

        if (!cart) {
            // Create a new cart if one doesn't exist
            cart = new cartModel({ items: [], totalItems: 0, totalPrice: 0 });
        }

        // Check if the item already exists in the cart
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex > -1) {
            // Update the quantity and total for the existing item
            const existingItem = cart.items[existingItemIndex];
            existingItem.quantity += quantity;
            existingItem.total = existingItem.quantity * price;
        } else {
            // Add the new item to the cart
            const newItem = {
                productId,
                name,
                quantity,
                price,
                total: quantity * price
            };
            cart.items.push(newItem);
        }

        // Recalculate total items and total price
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);

        // Save the cart
        await cart.save();

        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the item to the cart.', error: error.message });
    }
};



const checkout = async (req, res) => {
  try {
    // Find the cart (modify query if you have user-specific carts)
    const cart = await cartModel.findOne(); // Include userId in the query if necessary
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    // Validate cart total price
    const calculatedTotalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

   

    // Perform checkout (logic like processing payment could go here)
    console.log('Processing payment for total:', cart.totalPrice);

    // Clear the cart after successful checkout
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    cart.updatedAt = new Date(); // Update timestamp

    await cart.save();

    res.status(200).json({
      message: 'Checkout successful',
      checkoutDetails: {
        totalItems: 0,
        totalPrice: 0,
        status: 'Processed',
      },
    });
  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {checkout, addToCart};
