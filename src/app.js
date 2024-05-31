var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
const connectMongoDB = require('./dbs/mongodb');
// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Database connection
connectMongoDB();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/v1/product', require('./routes/product'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/cart', require('./routes/cart'));
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/index'));
app.use('/add', require('./routes/index'));
app.use('/admin/index', require('./routes/index'));
app.use('/product', require('./routes/index'));
app.use('/edit/:_id', require('./routes/index'));
app.use('/chat', require('./routes/index'));

// Socket.io setup
const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("connected ", socket.id);
    socket.broadcast.emit("hi");

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });
});
server.listen(3002);
module.exports = app;

