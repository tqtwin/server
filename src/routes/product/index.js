const express = require('express');
const router = express.Router();
const productModel = require('../../models/product');
// const  products = require('../../data/product');
router.use(express.json()); // Middleware to parse JSON bodies

const ProductController = require('../../controller/product.controller.js');
// Define your routes
router.get('/list-item', ProductController.getProductList);
router.get('/get-product/:_id',ProductController.getProductOne);
// Xem chi tiết sản phẩm
router.post('/add', ProductController.addProduct);
router.put('/edit/:_id',ProductController.editProduct);

router.delete('/delete/:_id',ProductController.deleteProduct)




module.exports = router;
