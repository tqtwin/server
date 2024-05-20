
const userModel =require('../models/user');
const path = require('path');
const bcrypt = require('bcryptjs');
class loginController {
    async signup(req, res, next) {
        try {
            const { name, age, avatar, username, password, email } = req.body;

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo một đối tượng user mới với mật khẩu đã mã hóa và các thông tin khác
            const user = new userModel({
                name: name,
                age: age,
                avatar: avatar,
                username: username,
                password: hashedPassword,
                email: email
            });
            // Lưu người dùng vào cơ sở dữ liệu
            await user.save();

            console.log('User added successfully');
            return res.json(user);
        } catch (error) {
            console.error('Error adding user:', error);
            console.log('Request body:', req.body);
            res.status(500).send("Error adding user");
        }
    }


    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await userModel.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại", success: false });
            }

            // So sánh mật khẩu nhập vào với mật khẩu đã được mã hóa trong cơ sở dữ liệu
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Mật khẩu không đúng", success: false });
            }
            // Lưu thông tin người dùng vào session
            req.session.user = user;
            res.json(req.session);
        } catch (error) {
            console.error('Lỗi khi kiểm tra đăng nhập:', error);
            res.status(500).json({ message: "Lỗi khi kiểm tra đăng nhập", success: false });
        }
    }

    logout(req, res, next) {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/');
            }
            res.clearCookie('user');
            return res.redirect('/');
        });
    }

}
module.exports = new loginController();