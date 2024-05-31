const express = require('express');
const router = express.Router();
const cartController = require('../../controller/cart-controller.js');

router.use(express.json());
router.post('/add-cart/:_id', cartController.addCart);
router.get('/getcart', cartController.getCart);
//router delete cart
router.use(cartController.getCartItemCount);
router.get('/delete-cart/:_id', cartController.deleteCart);
router.post('/check-coupon',cartController.checkCouponCode)
router.post('/addcoupon', cartController.addCoupon);
router.get('/coupon',cartController.getCoupon)
router.post('/edit-coupon/:_id',cartController.editCoupon);
router.get('/edit-coupon/:_id',cartController.getcouponOne);
router.post('/order', cartController.createOrder);
router.get('/orderhistory', cartController.getOrder);
router.get('/orderadmin/:status', cartController.getOrderAdmin);
router.post('/update-status', cartController.updateOrderStatus);
router.post('/update-quantity', cartController.updateQuantity);
router.get('/deletecoupon/:_id', cartController.deleteCoupon);
module.exports = router;

