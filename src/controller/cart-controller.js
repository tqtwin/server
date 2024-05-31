const cartModel = require('../models/cart');
const productModel = require('../models/product');
const couponModel = require('../models/Coupon');
const orderModel = require('../models/order');
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
    async getOrder(req, res, next) {
        try {
            // Kiểm tra xem session user đã được đăng nhập chưa
            if (res.locals.session && res.locals.session.user) {
                // Lấy userID từ session user
                const email = res.locals.session.user.email;
                // Tìm tất cả các đơn hàng của user hiện tại
                const orders = await orderModel.find({ email }).populate('items.productId').exec();
                console.log(orders);
                return orders;
            } else {
                // Nếu session user chưa đăng nhập, trả về lỗi
                res.status(401).send('User not logged in');
            }
        } catch (error) {
            console.error('Error fetching orders from MongoDB:', error);
            res.status(500).send("An error occurred while fetching orders from MongoDB");
        }
    }
    async getOrderAdmin(status) {
        try {
            const orders = await orderModel.find({ status }); // Sử dụng status từ tham số của hàm
            return orders;
        } catch (error) {
            console.error('Error fetching orders from MongoDB:', error);
            throw new Error("An error occurred while fetching orders from MongoDB");
        }
    }
    async updateQuantity(req, res, next) {
        try {
            const { itemId, quantity } = req.body;
            const cart = await cartModel.findOne({ 'items._id': itemId }); // Tìm giỏ hàng chứa mục cần cập nhật
            if (!cart) {
                return res.status(404).send('Cart not found');
            }
            const item = cart.items.find(item => item._id.equals(itemId));
            if (!item) {
                return res.status(404).send('Item not found in cart');
            }
            // Cập nhật số lượng sản phẩm trong mục
            item.quantity = quantity;
            await cart.save();

            console.log('Quantity updated successfully');
            // Trả về phản hồi thành công nếu cập nhật thành công
            res.status(200).json({ success: true, message: 'Quantity updated successfully' });
        } catch (error) {
            console.error('Error updating quantity:', error);
            res.status(500).send("Error updating quantity");
        }
    }

    async addCart(req, res, next) {
        try {
            const productId = req.params._id;
            const product = await productModel.findById(productId);

            if (!product) {
                return res.status(404).send('Product not found');
            }
            const userId = req.body.userId;

            let cart = await cartModel.findOne({ userId }); // Tìm giỏ hàng dựa trên userId

            if (!cart) {
                cart = new cartModel({ userId, items: [] }); // Tạo mới giỏ hàng với userId
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
            res.redirect('/cart'); // Chuyển đến trang cart
        } catch (error) {
            console.error('Error adding item:', error.message, error.stack);
            res.status(500).send("Error adding item");
        }
    }
    async deleteCart(req, res, next) {
        try {
            const itemId = req.params._id; // Lấy id của mục trong giỏ hàng từ URL
            const cart = await cartModel.findOne(); // Giả định chỉ có một giỏ hàng
            console.log(itemId);
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

    async getCartItemCount(req, res, next) {
        try {
            // Kiểm tra xem session user đã được đăng nhập chưa
            if (res.locals.session && res.locals.session.user) {
                // Lấy userID từ session user
                const userId = res.locals.session.user._id;
                // Tìm giỏ hàng của user hiện tại
                const cart = await cartModel.findOne({ userId });
                let itemCount = 0;

                if (cart) {
                    // Tính tổng số lượng mục trong giỏ hàng
                    itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
                }
                // Gán số lượng mục vào res.locals để sử dụng ở middleware tiếp theo hoặc trong các tệp EJS
                res.locals.cartItemCount = itemCount;
            } else {
                // Nếu session user chưa đăng nhập, đặt số lượng mục là 0
                res.locals.cartItemCount = 0;
            }
            // Chuyển đến middleware tiếp theo
            next();
        } catch (error) {
            console.error('Error fetching cart item count:', error.message, error.stack);
            // Nếu có lỗi, đặt số lượng mục là 0 và chuyển đến middleware tiếp theo
            res.locals.cartItemCount = 0;
            next();
        }
    }
    async deleteCoupon(req, res) {
        try {
            const id = req.params._id;

            const deleteCoupon = await couponModel.findByIdAndDelete(id);
            if (!deleteCoupon) {
                console.error('product not found for ID:', userId);
                return res.status(404).json({ message: 'User not found' });
            }
            // Sau khi xóa tài khoản, bạn có thể chuyển hướng hoặc cập nhật trang account
            return res.redirect('/coupon');
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: "An error occurred while deleting the user" });
        }
    }
    async createOrder(req, res, next) {
        try {
            const userId = req.body.userid;
            const cart = await cartModel.findOne({ userId });
            console.log(userId);
            if (!cart || cart.items.length === 0) {
                return res.status(400).send('Cart is empty');
            }
            const orderData = {
                recipientname: req.body.recipientname,
                phone: req.body.phone,
                address: req.body.address,
                email: req.body.email,
                note: req.body.note,
                total: req.body.totalAmount,
                items: cart.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    image:item.image,
                    name:item.name,
                    price: item.price
                })),
                username: req.body.username,
                status: 'Chờ xử lý' // Example status
            };
            const newOrder = new orderModel(orderData);
            await newOrder.save();

            // Clear the cart after creating the order
            cart.items = [];
            await cart.save();

            res.redirect('/cart'); // Redirect to a success page or send a success response
        } catch (error) {
            console.error('Error creating order:', error.message, error.stack);
            res.status(500).send("Error creating order");
        }
    }
    async updateOrderStatus(req, res, next) {
        try {
            const { orderId, status } = req.body;
            const order = await orderModel.findById(orderId);
            if (order) {
                order.status = status;
                await order.save();
                res.status(200).send({ message: 'Order status updated successfully' });
            } else {
                res.status(404).send({ message: 'Order not found' });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).send("An error occurred while updating the order status");
        }
    }

    async checkCouponCode(req, res, next) {
        try {
            const { code } = req.body;

            // Kiểm tra tính hợp lệ của dữ liệu
            if (!code) {
                return res.status(400).json({ message: "Vui lòng cung cấp mã coupon" });
            }

            // Tìm coupon trong cơ sở dữ liệu dựa trên mã coupon
            const coupon = await couponModel.findOne({ code });

            // Kiểm tra xem mã coupon có tồn tại không
            if (!coupon) {
                return res.status(404).json({ message: "Mã coupon không tồn tại" });
            }

            // Kiểm tra xem mã coupon đã hết hạn chưa
            if (coupon.expirationDate <= Date.now()) {
                return res.status(400).json({ message: "Mã coupon đã hết hạn" });
            }

            // Trả về phản hồi thành công với thông tin mã coupon và dữ liệu giảm giá
            return res.status(200).json({ message: "Mã coupon hợp lệ", coupon, discountAmount: coupon.discountPercentage });
        } catch (error) {
            console.error('Lỗi khi kiểm tra mã coupon:', error);
            return res.status(500).json({ message: "Đã xảy ra lỗi khi kiểm tra mã coupon" });
        }
    }

    async editCoupon(req, res, next) {
        try {
            const couponId = req.params._id;
            const couponData = req.body;

            // Ensure to use the { new: true } option to return the updated document
            const updatedCoupon = await couponModel.findByIdAndUpdate(couponId, couponData, { new: true });

            if (!updatedCoupon) {
                console.error('Product not found for ID:', couponId);
                return res.status(404).json({ message: 'Product not found' });
            }

            console.log("Updated product:", updatedCoupon);
            res.redirect('/coupon');
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).send("An error occurred while updating the product");
        }
    }
    async getcouponOne(req, res, next) {
        try {
            const couponId = req.params._id;
            const newCoupon = couponModel.findById(couponId);
            // console.log(newProduct);
            return newCoupon
        } catch (error) {
            console.error('Error fetching product from MongoDB:', error);
            res.status(500).send("An error occurred while fetching product from MongoDB");
        }
    }

    async addCoupon(req, res, next) {
        try {
            const coupon = req.body;
            // console.log(item)
            const couponList = new couponModel(coupon);
            // Save the product to the database
            await couponList.save();
            // console.log('Item added successfully');
            res.redirect('/admin');
        } catch (error) {
            console.error('Error adding item:', error);
            res.status(500).send("Error adding item");
        }
    }
    async getCoupon(req, res, next) {
        try {
            const couponFromDB = await couponModel.find();
            // console.log(productsFromDB);
            return couponFromDB;
        } catch (error) {
            console.error('Error fetching product list from MongoDB:', error);
            res.status(500).send("An error occurred while fetching product list from MongoDB");
        }
    }
}

module.exports = new cartController();
