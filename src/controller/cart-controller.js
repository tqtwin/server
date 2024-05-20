const cartModel = require('../models/cart');
const productModel = require('../models/product');

class cartController {
    async getCart(req, res, next) {
        try {
            const cartFromDB = await cartModel.find();
            console.log(cartFromDB);
            return cartFromDB;
        } catch (error) {
            console.error('Error fetching product list from MongoDB:', error);
            res.status(500).send("An error occurred while fetching product list from MongoDB");
        }
    }

    async addCart(req, res, next) {
        try {
            const productId = req.params._id; // Lấy id sản phẩm từ URL
            const product = await productModel.findById(productId);

            if (!product) {
                return res.status(404).send('Product not found');
            }

            let cart = await cartModel.findOne(); // Giả định chỉ có một giỏ hàng

            if (!cart) {
                cart = new cartModel({ items: [] });
            }

            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += 1;
            } else {
                cart.items.push({
                    productId: productId,
                    quantity: 1,
                    price: product.price,
                    image: product.image,
                    name: product.name
                });
            }
            await cart.save();
            console.log('Cart updated successfully');
            res.redirect('/cart');//chuyển đến trang cart
        } catch (error) {
            console.error('Error adding item:', error.message, error.stack);
            res.status(500).send("Error adding item");
        }
    }
    // deletCart ONE item
    async deleteCart(req, res, next) {
        try {
            const itemId = req.params._id; // Lấy id của mục trong giỏ hàng từ URL
            const cart = await cartModel.findOne(); // Giả định chỉ có một giỏ hàng

            if (!cart) {
                return res.status(404).send('Cart not found');
            }

            // Tìm và xóa mục trong giỏ hàng
            cart.items = cart.items.filter(item => !item._id.equals(itemId));

            // Kiểm tra nếu giỏ hàng trống thì xóa toàn bộ giỏ hàng
            if (cart.items.length === 0) {
                await cartModel.deleteOne({ _id: cart._id });
                console.log('Cart deleted successfully');
            } else {
                await cart.save(); // Lưu lại giỏ hàng sau khi xóa
                console.log('Item removed from cart successfully');
            }

            res.redirect('/cart');//chuyển đến trang cart
        } catch (error) {
            console.error('Error removing item from cart:', error.message, error.stack);
            res.status(500).send("Error removing item from cart");
        }
    }



}

module.exports = new cartController();
