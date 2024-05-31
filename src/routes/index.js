const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const sessionMiddleware = require('../Middleware/session');
const loginController = require('../controller/login-controller');
const productController = require('../controller/product.controller');
const cartController = require('../controller/cart-controller');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride('_method'));
router.use(sessionMiddleware);
router.use(express.static('public'))
router.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
router.use(cartController.getCartItemCount);

router.post('/api/v1/users/login', loginController.login);
router.post('/api/v1/users/logout', loginController.logout);

function checkSession(req, res, next) {
    if (!req.session.admin) {
        return res.status(400).render('login', { message: 'Please login as admin ', success: false });
    }
    next();
}
router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/chat', (req, res) => {
    res.render('chat');
});
router.get('/search', async (req, res) => {
    try {
        const productsFind = await productController.findProductByName(req, res);
        res.render('indexFind', { productsFind: productsFind });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});
//change-password

router.get('/', async (req, res) => {
    try {
        const productsFromDB = await productController.getProductList();
        res.render('index', { products: productsFromDB });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});

router.get('/check-session', (req, res) => {
    console.log("Session data:", req.session);
    res.json(req.session);
});

router.get('/logout', loginController.logout);

router.get('/admin',checkSession, async (req, res) => {
    try {
        const productsFromDB = await productController.getProductList();
        res.render('../views/admin/admin', { products: productsFromDB });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});
router.get('/account',checkSession, async (req, res) => {
    try {
        const accountFromDB = await loginController.getAccountList();
        res.render('../views/admin/account', { accounts: accountFromDB });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});
router.get('/coupon',checkSession, async (req, res) => {
    try {
        const couponFromDB = await cartController.getCoupon();
        res.render('../views/admin/coupon', { coupons: couponFromDB });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/add',checkSession, (req, res) => {
    res.render('../views/admin/add');
});
router.get('/add-coupon',checkSession, (req, res) => {
    res.render('../views/admin/add-coupon');
});
router.get('/admin/index',checkSession, (req, res) => {
    res.render('../views/admin/index');
});

router.get('/edit/:_id',checkSession, async (req, res) => {
    try {
        const newProduct = await productController.getProductOne(req, res);
        res.render('../views/admin/edit', { product: newProduct });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});

router.get('/change-password/', async (req, res) => {
    res.render('update-password')
});
router.get('/resetpassword/', async (req, res) => {
    res.render('resetpassword')
});
router.get('/orderhistory', async (req, res) => {
    try {
        const orders = await cartController.getOrder(req, res);
        res.render('order', { orders: orders });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});
router.post('/reset-password/', async (req, res) => {
    try {
        await loginController.resetPassword(req, res);
        res.status(201).send("Product added successfully");
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send("Error adding product");
    }
});

router.get('/edit-coupon/:_id', async (req, res) => {
    try {
        const newCoupon = await cartController.getcouponOne(req, res);
        res.render('../views/admin/edit-coupon', { coupon: newCoupon });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});
router.get('/update-user/:_id', async (req, res) => {
    try {
        const newUser = await loginController.getUserOne(req, res);
        res.render('user', { user: newUser });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});

router.get('/cart', async (req, res) => {
    try {
        const cartFromDB = await cartController.getCart();
        res.render('cart', { carts: cartFromDB });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});
router.get('/orderadmin/:status', async (req, res) => {
    try {
        const status = req.params.status;
        const orders = await cartController.getOrderAdmin(status); // Truyền status vào hàm getOrderAdmin
        res.render('../views/admin/ordercontroll', { orders: orders });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});

router.get('/:_id', async (req, res) => {
    try {
        const newProduct = await productController.getProductOne(req, res);
        const uniqueCategories = await productController.getCategory(req, res);
        console.log(uniqueCategories); // Kiểm tra cấu trúc của uniqueCategories
        res.render('shop-detail', { product: newProduct, categories: uniqueCategories });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});


router.post('/add', async (req, res) => {
    try {
        await productController.addProduct(req, res);
        res.status(201).send("Product added successfully");
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send("Error adding product");
    }
});
router.post('/update-quantity', async (req, res) => {
    try {
        await cartController.updateQuantity(req, res);
        res.status(201).send("Product added successfully");
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send("Error adding product");
    }
});

router.post('/signup', async (req, res) => {
    try {
        await loginController.signup(req, res);
        res.status(201).send("Product added successfully");
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send("Error adding product");
    }
});
router.post('/review/:_id', async (req, res) => {
    try {
        await productController.addReview(req, res);
        res.status(201).send("Product added successfully");
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send("Error adding product");
    }
});
router.get('/lockaccount/:_id', async (req, res) => {
    try {
        await loginController.lockAccount(req, res);
        res.status(201).send("Product added successfully");
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send("Error adding product");
    }
});
router.get('/deleteaccount/:_id', async (req, res) => {
    try {
        await loginController.deleteUser(req, res);
        res.status(201).send("Product added successfully");
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send("Error adding product");
    }
});
router.get('/deletecoupon/:_id', async (req, res) => {
    try {
        await cartController.deleteCoupon(req, res);

    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send("Error adding product");
    }
});
router.post('/addcoupon', async (req, res) => {
    try {
        await cartController.addCoupon(req, res);
        res.status(201).send("Product added successfully");
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send("Error adding product");
    }
});

router.post('/edit/:_id', async (req, res) => {
    try {
        await productController.editProduct(req, res);
        res.status(200).send("Product updated successfully");
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send("Error updating product");
    }
});
router.post('/change-password/:_id', async (req, res) => {
    try {
        await loginController.changePassword(req, res);
        res.status(200).send("Product updated successfully");
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send("Error updating product");
    }
});

router.post('/check-email/', async (req, res) => {
    try {
        await loginController.checkEmail(req, res);
        res.status(200).send("Product updated successfully");
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send("Error updating product");
    }
});

router.post('/edit-coupon/:_id', async (req, res) => {
    try {
        await cartController.editCoupon(req, res);
        res.status(200).send("coupon edit successfully");
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send("Error updating product");
    }
});
router.post('/update-user/:_id', async (req, res) => {
    try {
        await loginController.updateUser(req, res);
        res.status(200).send("Product updated successfully");
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send("Error updating product");
    }
});

router.get('/delete/:_id', async (req, res) => {
    try {
        await productController.deleteProduct(req, res);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send("Error deleting product");
    }
});

router.post('/add-cart/:_id', async (req, res) => {
    try {
        await cartController.addCart(req, res);
        res.status(201).send("Item added to cart successfully");
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send("Error adding to cart");
    }
});
router.post('/order', async (req, res) => {
    try {
        await cartController.createOrder(req,res)
        res.status(201).send("Item added to cart successfully");
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send("Error adding to cart");
    }
});

router.get('/delete-cart/:_id', async (req, res) => {
    try {
        await cartController.deleteCart(req, res);
        res.status(200).send("Item deleted from cart successfully");
    } catch (error) {
        console.error('Error deleting from cart:', error);
        res.status(500).send("Error deleting from cart");
    }
});

// Route cho việc load nội dung động
router.get('/product', (req, res) => {
    res.render('product');
});

module.exports = router;
