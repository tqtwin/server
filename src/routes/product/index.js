const express = require('express');
const router = express.Router();
const ProductController = require('../../controller/product.controller.js');

router.use(express.json());

router.get('/list-item', ProductController.getProductList);
router.get('/:_id', ProductController.getProductOne);
router.post('/add', ProductController.addProduct);
router.post('/edit/:_id', ProductController.editProduct);
router.get('/delete/:_id', ProductController.deleteProduct);
router.get('/search', ProductController.findProductByName);
router.post('/review/:_id', ProductController.addReview);
module.exports = router;
