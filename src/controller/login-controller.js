const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
class LoginController {
    async signup(req, res) {
        try {
            const { name, age, avatar, username, password, email, phone } = req.body;

            // Check if email, phone, or username already exists in the database
            const existingUser = await userModel.findOne({ $or: [{ email },{ username }] });
            if (existingUser) {
                return res.status(400).render('signup', { message: 'Email, phone, or username already exists', success: false });
            }
            // If no existing user, hash the password and create a new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new userModel({ name, age, avatar, username, password: hashedPassword, email, phone });
            await user.save();
            return res.redirect('/login');

        } catch (error) {
            console.error('Error adding user:', error);
            console.log('Request body:', req.body);
            return res.status(500).render('signup', { message: "Error adding user", success: false });
        }
    }


    async login(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                console.log('Missing username or password');
                return res.status(400).render('login', { message: "Username and password are required", success: false });
            }
            const user = await userModel.findOne({ username });
            if (!user) {
                console.log('User not found:', username);
                return res.status(404).render('login', { message: "Invalid username or password", success: false });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                console.log('Password does not match for user:', username);
                return res.status(401).render('login', { message: "Invalid username or password", success: false });
            }

            if (user.role === 'admin') {
                req.session.admin = user;
                return res.redirect('/admin');
            } else {
                req.session.user = user;
                return res.redirect('/');
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).render('login', { message: "Internal server error", success: false });
        }
    }


    async lockAccount(req, res) {
        try {
            const userId = req.params._id;
            console.log(userId);
            const user = await userModel.findById(userId);
            if (!user) {
                console.error('User not found for ID:', userId);
                return res.status(404).json({ message: 'User not found' });
            }
            if(user.tinhtrang == 'khóa')
                {
                    user.tinhtrang = 'mở';
                }
            // Thực hiện logic để khóa tài khoản ở đây, ví dụ:
                else{
                    user.tinhtrang = 'khóa';
                }
            await user.save();

            // Sau khi khóa tài khoản, bạn có thể chuyển hướng hoặc cập nhật trang account
            return res.redirect('/account');
        } catch (error) {
            console.error('Error locking account:', error);
            return res.status(500).json({ message: "An error occurred while locking the account" });
        }
    }
    async deleteUser(req, res) {
        try {
            const userId = req.params._id;

            const deletedUser = await userModel.findByIdAndDelete(userId);
            if (!deletedUser) {
                console.error('User not found for ID:', userId);
                return res.status(404).json({ message: 'User not found' });
            }

            // Sau khi xóa tài khoản, bạn có thể chuyển hướng hoặc cập nhật trang account
            return res.redirect('/account');
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: "An error occurred while deleting the user" });
        }
    }

    logout(req, res) {
        if(req.session.admin){
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send("An error occurred during logout");
            }
            res.clearCookie('connect.sid');
            return res.redirect('/admin');
        });}
        else{
            req.session.destroy(err => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).send("An error occurred during logout");
                }
                res.clearCookie('connect.sid');
                return res.redirect('/');
            });
        }

    }
    async updateUser(req, res, next) {
        try {
            const userId = req.params._id;
            const userData = req.body;
            // Log the incoming data for debugging
            console.log("Updating user ID:", userId);
            console.log("user data:", userData);
            // Ensure to use the { new: true } option to return the updated document
            const updateduser = await userModel.findByIdAndUpdate(userId, userData, { new: true });

            if (!updateduser) {
                console.error('user not found for ID:', userId);
                return res.status(404).json({ message: 'user not found' });
            }
            console.log("Updated user:", updateduser);
            res.redirect('/update-user/' + userId);//chuyển đến trang cart
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).send("An error occurred while updating the user");
        }
    }
    async getUserOne(req, res, next) {
        try {
            const userId = req.params._id;
            const newuser = userModel.findById(userId);
            // console.log(newuser);

            return newuser
        } catch (error) {
            console.error('Error fetching user from MongoDB:', error);
            res.status(500).send("An error occurred while fetching user from MongoDB");
        }
    }
    //chang-password
    async changePassword(req, res) {
        try {
            const userId = req.params._id;
            const { oldPassword, newPassword } = req.body;
            const user = await userModel.findById(userId);
            const passwordMatch = await bcrypt.compare(oldPassword, user.password);
            console.log(userId);
            console.log(oldPassword);
            console.log(newPassword);
            if (!passwordMatch) {
                console.log('Current password is incorrect');
                return res.status(401).json({ message: "Current password is incorrect", success: false });
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();
            return res.redirect('/update-user/'+req.params._id);
        } catch (error) {
            console.error('Error changing password:', error);
            return res.status(500).json({ message: "An error occurred while changing password", success: false });
        }
    }
    async getAccountList(req, res, next) {
        try {
            const accountFromDB = await userModel.find();
            // console.log(productsFromDB);
            return accountFromDB;
        } catch (error) {
            console.error('Error fetching product list from MongoDB:', error);
            res.status(500).send("An error occurred while fetching product list from MongoDB");
        }
    }
    async checkEmail(req, res) {
        try {
            const { email } = req.body;
            console.log(email);
            const user = await userModel.findOne({ email });

            if (user) {
                // Tạo mã code
                const code = generateRandomCode(6); // Hoặc sử dụng hàm tạo mã ngẫu nhiên
                req.session.resetcode = code
                // Gửi mã code đến email của người dùng
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'thangtran081003@gmail.com',
                        pass: 'nycz djgk gdaf jysa'
                    }
                });
                let mailOptions = {
                    from: 'thangtran081003@gmail.com',
                    to: email,
                    subject: 'Verification Code',
                    text: `Your verification code is: ${code}`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Error sending email" });
                    }
                    console.log('Email sent: ' + info.response);
                    req.session.emailreset = email;
                    return res.json({ message: "Verification code sent to your email", success: true });
                });
            } else {
                return res.json({ exists: false, message: "Email not found in database" });
            }
        } catch (error) {
            console.error('Error checking email:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async resetPassword(req, res) {
        try {
            const { verificationCode, newPassword, confirmPassword } = req.body;

            // Kiểm tra mật khẩu mới và xác nhận mật khẩu
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: "Passwords do not match" });
            }

            // Lấy mã code reset từ session
            const resetCodeFromSession = req.session.resetcode;

            // Kiểm tra xem mã code reset từ session có khớp với mã code từ người dùng không
            if (resetCodeFromSession !== verificationCode) {
                return res.redirect('resetpassword',{ message: "Invalid or expired code" });
            }

            // Lấy email từ session
            const email = req.session.emailreset;

            // Kiểm tra xem email có được lưu trong session không
            if (!email) {
                return res.redirect('resetpassword',{ message: "Email not found in session" });
            }
            // Xóa mã code reset và email từ session sau khi sử dụng
            delete req.session.resetcode;
            delete req.session.emailreset;

            // Tìm người dùng trong cơ sở dữ liệu bằng email
            const user = await userModel.findOne({ email });
            // Kiểm tra xem có người dùng nào được tìm thấy không
            if (!user) {
                return res.redirect('resetpassword',{ message: "User not found" });
            }
            // Mã hóa mật khẩu mới
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Cập nhật mật khẩu mới cho người dùng
            user.password = hashedPassword;
            console.log(user);
            await user.save();
            // Chuyển hướng người dùng đến trang đăng nhập sau khi đã reset mật khẩu thành công
            return res.redirect('/login');
        } catch (error) {
            console.error('Error resetting password:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }


}
function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = new LoginController();
