import User from '../models/User.js';
import jwt from 'jsonwebtoken';
// import randomstring from 'randomstring';
import bcrypt from 'bcryptjs';
import sendMail from '../utils/email.js';
import customLog from '../utils/customLog.js';

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

// Verify account controller
export const verifyController = async (req, res) => {
    try {
        const verifyEmailToken = req.query.token; // ?key1=value1&key2=value2...

        jwt.verify(verifyEmailToken, process.env.VERIFY_EMAIL_SECRET, async (err, user) => {
            if (err) return res.status(403).json({ code: 403, message: 'Token is not valid or it is expired!' });

            await User.findByIdAndUpdate(user._id, { $set: { isActived: true } });

            const currUser = await User.findById(user._id);

            // Send password to user
            const subject = 'Hệ thống quản lý văn bản - Lấy mật khẩu';
            // const html = `<p>Xin chào ${currUser.fullName}, đây là mật khẩu mặc định của bạn <span style="color: red; font-weight: bold">${user.password}</span></p>
            // <p><b>HÃY THAY ĐỔI MẬT KHẨU ĐỂ BẢO MẬT TÀI KHOẢN.</b></p>
            // `;
            const html = `<p>Xin chào ${currUser.email}, đây là mật khẩu mặc định của bạn <span style="color: red; font-weight: bold">${user.password}</span></p>
            <p><b>HÃY THAY ĐỔI MẬT KHẨU ĐỂ BẢO MẬT TÀI KHOẢN.</b></p>
            `;
            sendMail(currUser.email, subject, html);
            res.status(200).send('Xác thực tài khoản thành công, hãy kiểm tra email của bạn để lấy mật khẩu');
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error!' });
        console.log(error);
    }
};

// Sign in controller
export const signInController = async (req, res) => {
    try {
        // customLog(req);
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

        const isEmailExist = await User.findOne({ email: email });
        if (!isEmailExist) return res.status(403).json({ code: 403, message: 'Email không tồn tại' });

        const userData = await User.findOne({ email: email });
        if (userData) {
            const subject = 'Hệ thống quản lý văn bản - Đặt lại mật khẩu';
            const resetPasswordToken = generateResetPasswordToken(userData);

            // const html = `<p> Xin chào ${userData.email}, Hãy nhấn vào <a href="${process.env.REACT_APP_BASE_URL}/reset-password">liên kết</a> này và đặt lại mật khẩu của bạn.</p>
            // <p>Thời gian hiệu lực trong vòng 10 phút.</p>`;
            const html = `<div>
            <div style="background-color:#fafafa; margin:0">
                <table
                    style="font-family:'Roboto', sans-serif, 'Open Sans'; font-size:14px; color:#5e5e5e; width:98%; max-width:600px; float:none; margin:0 auto"
                    border="0" 
                    cellpadding="0" 
                    cellspacing="0" 
                    valign="top" 
                    align="left">
                    <tbody>
                        <tr align="middle">
                            <td style="padding-top:30px; padding-bottom:32px"></td>
                        </tr>
                        <tr bgcolor="#ffffff">
                            <td>
                                <table 
                                    bgcolor="#ffffff"
                                    style="width:100%;line-height:20px;padding:32px;border:1px solid;border-color:#f0f0f0"
                                    cellpadding="0">
                                    <tbody>
                                        <tr>
                                            <td style="color:#5e5e5e; font-size:22px; line-height:22px">
                                                Yêu cầu đặt lại mật khẩu
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:24px; vertical-align:bottom">
                                                Xin chào ${userData.fullName},
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:24px">
                                                Ai đó đã yêu cầu mật khẩu mới cho tài khoản QLVB của bạn 
                                                <a 
                                                    href="mailto:${userData.email}"
                                                    target="_blank">
                                                    ${userData.email}
                                                </a>.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:24px">
                                                <a 
                                                    href=""
                                                    style="color:#007dc1;text-decoration:none" 
                                                    target="_blank">
                                                    <span
                                                        style="color:#007dc1;text-decoration:none"> 
                                                        Liên hệ bộ phận hỗ trợ 
                                                    </span>
                                                </a> 
                                                ngay lập tức nếu bạn không thực hiện yêu cầu này.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:24px">
                                                Vui lòng nhấp vào nút bên dưới để hoàn tất quá trình.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
                                                <table border="0" cellpadding="0" cellspacing="0" valign="top">
                                                    <tbody>
                                                        <tr>
                                                            <td align="center"
                                                                style="height:32px; padding-top:24px; padding-bottom:8px">
                                                                <a
                                                                    href="${process.env.REACT_APP_BASE_URL}/reset-password"
                                                                    style="text-decoration:none" 
                                                                    target="_blank"
                                                                    data-saferedirecturl="">
                                                                    <span style="padding:9px 32px 7px 31px; border:1px solid; text-align:center; color:#fff; border-radius:3px; background-color:#00bceb; border-color:#00bceb #00bceb #1e4471">
                                                                        <span class="il">
                                                                            Đặt lại
                                                                        </span> 
                                                                        mật khẩu 
                                                                    </span> 
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center" style="color:#999">
                                                                Hết hạn sau 3 giờ.
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:24px">
                                                Truy cập phần 
                                                <a
                                                    href=""
                                                    style="color:#007dc1;text-decoration:none" 
                                                    target="_blank"
                                                    data-saferedirecturl="">
                                                    <span style="color:#007dc1;text-decoration:none"> 
                                                        trợ giúp 
                                                    </span> 
                                                </a> 
                                                để biết thêm thông tin về đăng nhập, mật khẩu và thông tin tài khoản. 
                                                <a 
                                                    href=""
                                                    style="color:#007dc1;text-decoration:none" 
                                                    target="_blank"> 
                                                    <span
                                                        style="color:#007dc1;text-decoration:none">
                                                        <br> Liên hệ bộ phận hỗ trợ
                                                    </span>
                                                </a> 
                                                để được trợ giúp truy cập vào tài khoản của bạn.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size:12px; padding:16px 0 30px 50px; color:#999; text-align:center">
                                Đây là tin nhắn được tạo tự động từ 
                                <a 
                                    href="" 
                                    style="color:rgb(97,97,97)"
                                    target="_blank"
                                    data-saferedirecturl="">
                                    QLVB
                                </a>.
                                Vui lòng không trả lời thư này.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div></div>`;

            sendMail(userData.email, subject, html);
            res.status(200).json({
                code: 200,
                message: 'Kiểm tra email và đặt lại mật khẩu của bạn',
                resetPasswordToken: resetPasswordToken,
            });
        } else {
            res.status(400).json({ code: 400, message: 'Email không tồn tại' });
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

            await User.findByIdAndUpdate(user._id, { $set: { password: newPassword } });

            res.status(200).json({ code: 200, message: 'Mật khẩu đã được đặt lại' });
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Refresh token controller
export const refreshController = async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(401).json({ code: 401, message: 'You are not authenticated!' });

    const currUser = await User.findById(req.params.userId);
    if (!(currUser?.refreshToken === refreshToken)) {
        return res.status(403).json({ code: 403, message: 'Refresh token is not valid!' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, user) => {
        err && console.log(err);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        const newTokenArray = currUser?.refreshTokens?.filter((token) => token !== refreshToken);
        newTokenArray.push(newRefreshToken);
        await User.findByIdAndUpdate(currUser._id, { refreshTokens: newTokenArray });

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    });
};

// Get current user controller
export const getCurrentUserController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select('-password');
        res.status(200).json(currentUser);
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error!' });
        console.log(error);
    }
};

// Sign out controller
export const signOutController = async (req, res) => {
    try {
        const currUser = await User.findById(req.user._id);
        let tokenArray = currUser.refreshTokens;

        const refreshToken = req.body.token;
        tokenArray = tokenArray.filter((token) => token !== refreshToken);
        // console.log(tokenArray);

        await User.findByIdAndUpdate(req.user._id, { $set: { refreshTokens: tokenArray } });

        res.status(200).json({ code: 200, message: 'Đăng xuất thành công' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: 'Unexpected error!' });
    }
};
