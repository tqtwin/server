// var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
app.use(bodyParser.json());
// database
app.use(require('./dbs/mongodb'));
const connectMongoDB = require('./dbs/mongodb');
const {products} = require('./data/product');
app.use(express.static('public'))
// view engine setup
app.use('/',require('./routes/index'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

connectMongoDB()
//render
app.get('/list-item', function (req, res, next) {
  const indexView = path.join(__dirname, 'views/index.ejs');
  res.render(indexView, { products: products}); // Render trang index.ejs với dữ liệu sản phẩm

});

module.exports = app;
