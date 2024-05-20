var express = require('express');
const productController = require('../controller/product.controller');
const cartController = require('../controller/cart-controller');
const methodOverride = require('method-override');
var router = express.Router();

//chat
router.use(methodOverride('_method'));
const path = require('path')
/* GET users listing. */
router.use('/api/v1/product', require('./product'));
router.use('/api/v1/users', require('./users'));
router.use('/api/v1/cart', require('./cart'));
const session = require('express-session');
router.use(session({
    secret: 'tranquocthangdeptrai', // Thay bằng chuỗi bí mật thực sự
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
router.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Định nghĩa route để gửi file HTML cho trang chính
router.get('/chat', (req, res) => {
    const chat = path.join(__dirname, '../views/chat.ejs');
    res.render(chat);
});
router.get('/', async (req, res) => {
    const productsFromDB = await productController.getProductList();
    res.render('index.ejs', { products: productsFromDB, session: req.session });
});
router.get('/logout')
//admin product
router.get('/admin', async (req, res) => {
    const productsFromDB = await productController.getProductList()
    const indexView = path.join(__dirname, '../views/admin.ejs');
    res.render(indexView, { products: productsFromDB });
})
router.get('/signup', (req, res) => {
    const signup = path.join(__dirname, '../views/signup.ejs');
    res.render(signup);
});

router.get('/add', async function (req, res, next) {
    try {
        const addView = path.join(__dirname, '../views/add.ejs');
        res.render(addView);
    } catch (error) {
        console.error('Error rendering add.ejs:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});
router.get('/edit/:_id', async function (req, res, next) {
    try {
        const newProduct = await productController.getProductOne(req, res);
        const indexView = path.join(__dirname, '../views/edit.ejs');
        res.render(indexView, { product: newProduct }); // Assuming you're rendering a single product
    } catch (error) {
        console.error('Error rendering product detail page:', error);
        res.status(500).send("An error occurred while rendering product detail page");
    }
});
// trang giỏ hàng
router.get('/cart', async (req, res) => {
    const cartFromDB = await cartController.getCart()
    const indexView = path.join(__dirname, '../views/cart.ejs');
    res.render(indexView, { carts: cartFromDB });
})
// trang đăng nhập
router.get('/login', async function (req, res, next) {
    try {
        const login = path.join(__dirname, '../views/login.ejs');
        res.render(login);
    } catch (error) {
        console.error('Error rendering add.ejs:', error);
        res.status(500).send("An error occurred while rendering the page.");
    }
});
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
router.post('/edit/:_id', async (req, res) => {
    try {
        await productController.editProduct(req, res);

    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).send("Error updating item");
    }
});
//xóa sản phẩm
router.get('/delete/:_id', async (req, res) => {
    try {
        await productController.deleteProduct(req, res);
        res.status(200).send("Product deleted successfully");
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send("Error deleting product");
    }
});
//thêm vào giỏ hàng
router.post('/add-cart/:_id', async (req, res) => {
    try {
        await cartController.addCart(req, res);
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send("Error adding item");
    }
});

//deletecart one item
router.get('/delete-cart/:_id', async (req, res) => {
    try {
        await cartController.deleteCart(req, res);
        res.status(200).send("item deleted successfully");
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send("Error deleting product");
    }
});


module.exports = router;

