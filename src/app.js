// var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
// database
const productModel  = require('./models/product');
app.use('/api/v1/product', require('./routes/product'));
// app.use(require('./dbs/mongodb'));
const connectMongoDB = require('./dbs/mongodb');
const {products} = require('./data/product');
app.use(express.static('public'))
// view engine setup
app.use('/',require('./routes/index'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

connectMongoDB()
app.use('/', require('./routes')); // Assuming router.js is in the same directory
//render
app.get('/add', (req, res) => {
  try {
    const addView = path.join(__dirname, 'views/add.ejs');
    res.render(addView);
  } catch (error) {
    console.error('Error rendering add.ejs:', error);
    res.status(500).send("An error occurred while rendering the page.");
  }
});

app.get('/edit/:_id', async function (req, res, next) {
  try {
    const productId = req.params._id; // Accessing the product ID from the route parameter
    const product = await productModel.findById(productId); // Finding the product by ID
    console.log('Dữ liệu từ productModel:', product); // Log the retrieved product
    const indexView = path.join(__dirname, 'views/edit.ejs');
    res.render(indexView, { product }); // Pass the product to the view for rendering
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm từ MongoDB:', error);
    res.status(500).send("Đã xảy ra lỗi khi lấy sản phẩm từ MongoDB");
  }
});


// app.get('/list-item', async function (req, res, next) {
//   try {
//     const productsFromDB = await productModel.find();
//     console.log('Dữ liệu từ productModel:', productsFromDB);
//     const indexView = path.join(__dirname, 'views/index.ejs');
//     res.render(indexView, { products: productsFromDB }); // Render trang index.ejs với dữ liệu sản phẩm từ MongoDB
//   } catch (error) {
//     console.error('Lỗi khi lấy danh sách sản phẩm từ MongoDB:', error);
//     res.status(500).send("Đã xảy ra lỗi khi lấy danh sách sản phẩm từ MongoDB");
//   }
// });
// app.get('/get-product/:_id', async function (req, res, next) {
//   try {
//     const product = req.body;
//     const newProduct = await productModel.find(product);
//     console.log('Dữ liệu từ productModel:', newProduct);
//     const indexView = path.join(__dirname, 'views/shop-detail.ejs');
//     res.render(indexView, { products: newProduct }); // Render trang index.ejs với dữ liệu sản phẩm từ MongoDB
//   } catch (error) {
//     console.error('Lỗi khi lấy danh sách sản phẩm từ MongoDB:', error);
//     res.status(500).send("Đã xảy ra lỗi khi lấy danh sách sản phẩm từ MongoDB");
//   }
// });
module.exports = app;

