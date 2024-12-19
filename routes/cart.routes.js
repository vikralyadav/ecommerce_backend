const express = require('express')
const router = express.Router();
const cartController = require('../controllers/cart.controller')
const authMiddleware = require('../middleware/auth')


router.post('/addToCart',authMiddleware.userAuth, cartController.addToCart);

router.get('/checkout', cartController.checkout);


module.exports = router;