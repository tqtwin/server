const express = require('express');
const router = express.Router();
const cartController = require('../../controller/cart-controller.js');

router.use(express.json());
router.post('/add-cart/:_id', cartController.addCart);

router.get('/getcart', cartController.getCart);
//router delete cart

router.get('/delete-cart/:_id', cartController.deleteCart);
module.exports = router;

