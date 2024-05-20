const express = require('express');
const router = express.Router();
const loginController = require('../../controller/login-controller.js');
const session = require('express-session');
router.use(express.json());
router.use(session({
    secret: 'tranquocthangdeptrai', // Thay bằng chuỗi bí mật thực sự
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt thành true nếu bạn dùng HTTPS
}));

router.post('/signup', loginController.signup);
// Đưa ra session hiện tại
router.get('/get', (req, res) => {
    res.json(req.session);
});
router.post('/login', loginController.login);

router.get('/logout', loginController.logout);


module.exports = router;
