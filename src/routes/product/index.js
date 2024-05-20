const express = require('express');
const router = express.Router();
const ProductController = require('../../controller/product.controller.js');

router.use(express.json());

router.get('/list-item', ProductController.getProductList);
router.get('/:id', ProductController.getProductOne);
router.post('/add', ProductController.addProduct);
router.post('/edit/:_id', ProductController.editProduct);
router.get('/delete/:_id', ProductController.deleteProduct);


module.exports = router;
