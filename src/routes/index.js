var express = require('express');
const productController = require('../controller/product.controller');
var router = express.Router();
const path = require('path')
/* GET users listing. */
router.use('/api/v1/product',require('./product'));

router.get('/',async (req,res)=> {
    const productsFromDB = await productController.getProductList()
    const indexView = path.join(__dirname, '../views/index.ejs');
    res.render(indexView, { products: productsFromDB });
})

router.get('/:_id', async (req, res) => {
    try {
        const newProduct = await productController.getProductOne(req, res);
        const indexView = path.join(__dirname, '../views/shop-detail.ejs');
        res.render(indexView, { product: newProduct }); // Assuming you're rendering a single product
    } catch (error) {
        console.error('Error rendering product detail page:', error);
        res.status(500).send("An error occurred while rendering product detail page");
    }
});
router.post('/add', async (req, res) => {
    try {
        await productController.addProduct(req, res);
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send("Error adding item");
    }
});
router.put('/edit/:_id', async (req, res) => {
    try {
        await productController.editProduct(req, res);

    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).send("Error updating item");
    }
});
router.delete('/delete/:_id', async (req, res) => {
    try {
        await productController.deleteProduct(req, res);
        res.status(200).send("Product deleted successfully");
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send("Error deleting product");
    }
});

module.exports = router;



