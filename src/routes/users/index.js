const express = require('express');
const router = express.Router();
const loginController = require('../../controller/login-controller.js');
const session = require('express-session');
const sessionMiddleware = require('../../Middleware/session.js');
const MongoStore = require('connect-mongo');
router.use(express.json());
router.use(sessionMiddleware);
router.use(express.urlencoded({ extended: true }));

router.post('/signup', loginController.signup);
// Đưa ra session hiện tại
router.post('/login', loginController.login);
router.get('/check-session', (req, res) => {
    console.log("Session data:", req.session);
    res.json(req.session);
});
router.get('/logout', loginController.logout);
router.post('/update-user/:_id',loginController.updateUser)
router.get('/update-user/:_id', loginController.getUserOne);
router.post('/change-password/:_id', loginController.changePassword);
router.post('/checkemail', loginController.checkEmail);
router.get('/acount', loginController.getAccountList)
router.post('/resetpassword', loginController.resetPassword);
router.get('/lockaccount/:_id', loginController.lockAccount);
router.get('/deleteaccount/:_id', loginController.deleteUser);
module.exports = router;
