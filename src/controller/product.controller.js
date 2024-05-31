const productModel = require('../models/product');
const path = require('path');
class ProductController {
    async getProductList(req, res, next) {
        try {
            const productsFromDB = await productModel.find();
            // console.log(productsFromDB);
            return productsFromDB;
        } catch (error) {
            console.error('Error fetching product list from MongoDB:', error);
            res.status(500).send("An error occurred while fetching product list from MongoDB");
        }
    }
    async getCategory(req, res, next) {
        try {
            // Truy xuất tất cả các sản phẩm từ cơ sở dữ liệu
            const productsFromDB = await productModel.find({});

            // Sử dụng một đối tượng để lưu số lượng sản phẩm cho từng danh mục
            const categoryCounts = {};

            // Duyệt qua từng sản phẩm và tăng số lượng cho danh mục tương ứng
            productsFromDB.forEach(product => {
                if (Array.isArray(product.categories)) {
                    product.categories.forEach(category => {
                        if (!categoryCounts[category]) {
                            categoryCounts[category] = 0;
                        }
                        categoryCounts[category]++;
                    });
                } else if (product.category) {
                    if (!categoryCounts[product.category]) {
                        categoryCounts[product.category] = 0;
                    }
                    categoryCounts[product.category]++;
                }
            });

            // Chuyển đối tượng thành mảng để dễ sử dụng
            const uniqueCategories = Object.keys(categoryCounts).map(category => ({
                name: category,
                count: categoryCounts[category]
            }));

            // Trả về danh sách các danh mục cùng với số lượng sản phẩm
            return uniqueCategories;
        } catch (error) {
            console.error('Error fetching categories from MongoDB:', error);
            res.status(500).send("An error occurred while fetching categories from MongoDB");
        }
    }


    async getProductOne(req, res, next) {
        try {
            const productId = req.params._id;
            const newProduct = productModel.findById(productId);
            // console.log(newProduct);

            return newProduct
        } catch (error) {
            console.error('Error fetching product from MongoDB:', error);
            res.status(500).send("An error occurred while fetching product from MongoDB");
        }
    }
    async addProduct(req, res, next) {
        try {
            const item = req.body; // Get data from the request body
            // console.log(item)
            const product = new productModel(item);
            // Save the product to the database
            await product.save();
            // console.log('Item added successfully');
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
    async deleteProduct(req, res) {
        try {
            const id = req.params._id;

            const deleteProduct = await productModel.findByIdAndDelete(id);
            if (!deleteProduct) {
                console.error('product not found for ID:', userId);
                return res.status(404).json({ message: 'User not found' });
            }
            // Sau khi xóa tài khoản, bạn có thể chuyển hướng hoặc cập nhật trang account
            return res.redirect('/admin');
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: "An error occurred while deleting the user" });
        }
    }
    async findProductByName(req, res, next) {
        try {
            const keyword = req.query.keyword;
            if (!keyword) {
                return res.status(400).send("Keyword query parameter is required");
            }
            // Sử dụng keyword để tìm kiếm sản phẩm
            const productsFind = await productModel.find({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { category: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } }
                ]
            });
            // Trả về kết quả tìm kiếm
            return productsFind;
        } catch (error) {
            console.error('Error finding product by name:', error);
            res.status(500).send("An error occurred while searching for the product");
        }
    }


    async addReview(req, res, next) {
        try {
            const productId = req.params._id;
            const { review, rating, userId ,name, email,avatar} = req.body;

            const product = await productModel.findById(productId);
            if (!product) {
                return res.status(404).send("Product not found");
            }

            const newReview = {
                userId,
                name,
                email,
                avatar,
                review,
                rating,
                created_at: new Date()
            };

            product.reviews.push(newReview);

            // Update product rating
            const totalReviews = product.reviews.length;
            const totalRating = product.reviews.reduce((acc, curr) => acc + curr.rating, 0);
            product.rating = totalRating / totalReviews;

            await product.save();
            //thông báo alert ra
            res.redirect('/'+productId);
        } catch (error) {
            console.error('Error adding review:', error);
            res.status(500).send("An error occurred while adding the review");
        }
    }
}



module.exports = new ProductController();
