import User from '../models/User.js';
import jwt from 'jsonwebtoken';
// import randomstring from 'randomstring';
import bcrypt from 'bcryptjs';
import sendMail from '../utils/email.js';

// Generate verify email token
// const generateVerifyEmailToken = (user, password) => {
//     return jwt.sign(
//         {
//             _id: user._id,
//             password: password,
//         },
//         process.env.VERIFY_EMAIL_SECRET,
//         { expiresIn: '1d' },
//     );
// };

// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            role: user.role,
        },
        process.env.ACCESS_SECRET,
        {
            expiresIn: '1d',
        },
    );
};

// Generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            role: user.role,
        },
        process.env.REFRESH_SECRET,
        {
            expiresIn: '1w',
        },
    );
};

// Generate reset password token
const generateResetPasswordToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
        },
        process.env.RESET_PASS_SECRET,
        {
            expiresIn: '600s',
        },
    );
};

// Sign up controller
// export const signUpController = async (req, res) => {
//     try {
//         const { email } = req.body;

//         const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//         if (!emailRegex.test(email)) return res.status(401).json({ code: 401, message: 'Email không hợp lệ!' });

//         const isEmailExist = await User.findOne({ email: email });
//         if (isEmailExist) return res.status(403).json({ code: 403, message: 'Email đã được sử dụng!' });

//         const randomPass = randomstring.generate(7);
//         const salt = bcrypt.genSaltSync(10);
//         const hashPass = bcrypt.hashSync(randomPass, salt);
//         
//         const newUser = new User({ ...req.body, password: hashPass });
//         await newUser.save();

//         const verifyEmailToken = generateVerifyEmailToken(newUser, randomPass);

//         const subject = 'Top Top - Xác thực tài khoản người dùng';
//         const html = `<p>Hãy nhấn vào <a href="${process.env.BASE_URL}/api/v1/auth/verify?token=${verifyEmailToken}"> liên kết</a> để xác thực tài khoản của bạn</p>
//         <p>Thời gian hiệu lực trong vòng 3 giờ.</p>`;
//         sendMail(newUser.email, subject, html);
//         res.status(200).json({
//             code: 200,
//             message: 'Tạo tài khoản thành công và email xác thực đã được gửi. Hãy kiểm tra hộp thư email của bạn.',
//         });
//     } catch (error) {
//         res.status(400).json({ code: 400, message: 'Unexpected error!' });
//         console.log(error);
//     }
// };

// Verify account controller
// export const verifyController = async (req, res) => {
//     try {
//         const verifyEmailToken = req.query.token; // ?key1=value1&key2=value2...

//         jwt.verify(verifyEmailToken, process.env.VERIFY_EMAIL_SECRET, async (err, user) => {
//             if (err) return res.status(403).json({ code: 403, message: 'Token is not valid or it is expired!' });

//             await User.updateOne({ _id: user._id }, { $set: { isActived: true } });

//             const currUser = await User.findById(user._id);
//             // Send password to user
//             const subject = 'Hệ thống quản lý văn bản - Lấy mật khẩu'; // const subject = 'Top Top - Lấy mật khẩu';

//             // const html = `<p>Xin chào ${currUser.fullName}, đây là mật khẩu mặc định của bạn <span style="color: red; font-weight: bold">${user.password}</span></p>
//             // <p><b>HÃY THAY ĐỔI MẬT KHẨU ĐỂ BẢO MẬT TÀI KHOẢN.</b></p>
//             // `;
//             const html = `<p>Xin chào ${currUser.email}, đây là mật khẩu mặc định của bạn <span style="color: red; font-weight: bold">${user.password}</span></p>
//             <p><b>HÃY THAY ĐỔI MẬT KHẨU ĐỂ BẢO MẬT TÀI KHOẢN.</b></p>
//             `;
//             sendMail(currUser.email, subject, html);
//             res.status(200).send('Xác thực tài khoản thành công, hãy kiểm tra email của bạn để lấy mật khẩu');
//         });
//     } catch (error) {
//         res.status(400).json({ code: 400, message: 'Unexpected error!' });
//         console.log(error);
//     }
// };

// Sign in controller
export const signInController = async (req, res) => {
    try {
        // console.log("req: ", req);
        const user = await User.findOne({ email: req.body.email }); // const user = await User.findOne({ userName: req.body.userName });
        
        if (!user || user.isActived === false)
            return res.status(404).json({ code: 404, message: 'Tài khoản không tồn tại hoặc đã bị xóa' });

        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrect)
            return res.status(400).json({ code: 400, message: 'Tên tài khoản hoặc mật khẩu không chính xác' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: refreshToken } });

        res.status(200).json({
            code: 200,
            message: 'Đăng nhập thành công',
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Forgot password controller
export const forgotPasswordController = async (req, res) => {
    try {
        const email = req.body.email;

        // const isEmailExist = await User.findOne({ email: email });
        // if (!isEmailExist) return res.status(403).json({ code: 403, message: 'Email không tồn tại' });

        // const userData = await User.findOne({ email: email });
        // if (userData) {
        //     const subject = 'Hệ thống quản lý văn bản - Đặt lại mật khẩu';
        //     const resetPasswordToken = generateResetPasswordToken(userData);
        //     const html = `<p> Xin chào ${userData.email}, Hãy nhấn vào <a href="${process.env.REACT_APP_BASE_URL}/reset-password">liên kết</a> này và đặt lại mật khẩu của bạn.</p>
        //     <p>Thời gian hiệu lực trong vòng 10 phút.</p>`;
        //     sendMail(userData.email, subject, html);
        //     res.status(200).json({
        //         code: 200,
        //         message: 'Kiểm tra email và đặt lại mật khẩu của bạn',
        //         resetPasswordToken: resetPasswordToken,
        //     });
        // } else {
        //     res.status(400).json({ code: 400, message: 'Email không tồn tại' });
        // }

        let userData;
        if (!(userData = await User.findOne({ email: email }))) {
            return res.status(403).json({ code: 403, message: 'Email không tồn tại' });
        } else {
            const subject = 'Hệ thống quản lý văn bản - Đặt lại mật khẩu';
            const resetPasswordToken = generateResetPasswordToken(userData);
            const html = `<p> Xin chào ${userData.email}, Hãy nhấn vào <a href="${process.env.REACT_APP_BASE_URL}/reset-password">liên kết</a> này và đặt lại mật khẩu của bạn.</p>
            <p>Thời gian hiệu lực trong vòng 10 phút.</p>`;
            sendMail(userData.email, subject, html);
            res.status(200).json({
                code: 200,
                message: 'Kiểm tra email và đặt lại mật khẩu của bạn',
                resetPasswordToken: resetPasswordToken,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Reset password controller
export const resetPasswordController = async (req, res) => {
    try {
        const token = req.body.token;
        jwt.verify(token, process.env.RESET_PASS_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json({ code: 403, message: 'Mã xác thực không hợp lệ hoặc đã hết hạn' });
            }
            const salt = bcrypt.genSaltSync(10);
            const newPassword = bcrypt.hashSync(req.body.password, salt);
            await User.updateOne({ _id: user._id }, { $set: { password: newPassword } });
            res.status(200).json({ code: 200, message: 'Mật khẩu đã được đặt lại' });
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Sign out controller
export const signOutController = async (req, res) => {
    try {
        const refreshToken = req.body.token;
        const currUser = await User.findById(req.user._id);
        let tokenArray = currUser.refreshTokens;
        tokenArray = tokenArray.filter((token) => token !== refreshToken);
        // console.log("tokenArray:", tokenArray);
        await User.findByIdAndUpdate(req.user._id, { $set: { refreshTokens: tokenArray } });
        res.status(200).json({ code: 200, message: 'Đăng xuất thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error!' });
        console.log(error);
    }
};

// Change password controller
// ...

// Get current user controller
// export const getCurrentUserController = async (req, res) => {
//     try {
//         const currentUser = await User.findById(req.user._id);
//         res.status(200).json(currentUser);
//     } catch (error) {
//         res.status(400).json({ code: 400, message: 'Unexpected error!' });
//         console.log(error);
//     }
// };

// Refresh token controller
// export const refreshController = async (req, res) => {
//     const refreshToken = req.body.token;
//     if (!refreshToken) return res.status(401).json({ code: 401, message: 'You are not authenticated!' });
//     const currUser = await User.findById(req.params.userId);
//     if (!currUser?.refreshTokens?.includes(refreshToken)) {
//         return res.status(403).json({ code: 403, message: 'Refresh token is not valid!' });
//     }

//     jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, user) => {
//         err && console.log(err); // ?

//         const newAccessToken = generateAccessToken(user);
//         const newRefreshToken = generateRefreshToken(user);

//         const newTokenArray = currUser?.refreshTokens?.filter((token) => token !== refreshToken);
//         newTokenArray.push(newRefreshToken);
//         await User.findByIdAndUpdate(currUser._id, { refreshTokens: newTokenArray });

//         res.status(200).json({
//             accessToken: newAccessToken,
//             refreshToken: newRefreshToken,
//         });
//     });
// };
