const productModel = require('../models/product');
const path = require('path');
class ProductController {
    async getProductList(req, res, next) {
        try {
            const productsFromDB = await productModel.find();
            console.log(productsFromDB);
            return productsFromDB;
        } catch (error) {
            console.error('Error fetching product list from MongoDB:', error);
            res.status(500).send("An error occurred while fetching product list from MongoDB");
        }
    }

    async getProductOne(req, res, next) {
        try {
            const productId = req.params._id;
            const newProduct = await productModel.findById(productId);
            console.log(newProduct);
            return newProduct;
        } catch (error) {
            console.error('Error fetching product from MongoDB:', error);
            res.status(500).send("An error occurred while fetching product from MongoDB");
        }
    }
    async addProduct(req, res, next) {
        try {
            const item = req.body; // Get data from the request body
            console.log(item)
            const product = new productModel(item);
            // Save the product to the database
            await product.save();
            console.log('Item added successfully');
            res.redirect('/admin');
        } catch (error) {
            console.error('Error adding item:', error);
            res.status(500).send("Error adding item");
        }
    }

    async editProduct(req, res, next) {
        try {
            const productId = req.params._id;
            const productData = req.body;
            // Log the incoming data for debugging
            console.log("Updating product ID:", productId);
            console.log("Product data:", productData);
            // Ensure to use the { new: true } option to return the updated document
            const updatedProduct = await productModel.findByIdAndUpdate(productId, productData, { new: true });

            if (!updatedProduct) {
                console.error('Product not found for ID:', productId);
                return res.status(404).json({ message: 'Product not found' });
            }

            console.log("Updated product:", updatedProduct);
            res.redirect('/admin');//chuyển đến trang cart
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).send("An error occurred while updating the product");
        }
    }

    async deleteProduct(req, res, next) {
        const id = req.params._id;
        const deleteProduct = await productModel.findByIdAndDelete(id);
        res.redirect('/admin');
    }

}

module.exports = new ProductController();
