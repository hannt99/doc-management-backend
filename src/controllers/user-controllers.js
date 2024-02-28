import User from '../models/User.js';
// import Task from '../models/Task.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import randomstring from 'randomstring';
import sendMail from '../utils/email.js';
import fs from 'fs';
import customLog from '../utils/customLog.js';

// Generate verify email token
const generateVerifyEmailToken = (user, password) => {
    return jwt.sign(
        {
            _id: user._id,
            password: password,
        },
        process.env.VERIFY_EMAIL_SECRET,
        { expiresIn: '1d' },
    );
};

// Create user controller
export const createUserController = async (req, res) => {
    try {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(req.body.email)) return res.status(401).json({ code: 401, message: 'Email không hợp lệ' });

        const isEmailExist = await User.findOne({ email: req.body.email });
        if (isEmailExist) return res.status(403).json({ code: 403, message: 'Email đã được sử dụng' });

        const randomPass = randomstring.generate(7);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(randomPass, salt);

        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();

        const token = generateVerifyEmailToken(newUser, randomPass);

        const subject = 'Hệ thống quản lý văn bản - Xác thực tài khoản người dùng';
        const html = `<p>Hãy nhấn vào <a href="${process.env.BASE_URL}/api/v1/auth/verify?token=${token}"> liên kết</a> để xác thực tài khoản của bạn</p>
        <p>Thời gian hiệu lực trong vòng 24 giờ</p>`;
        sendMail(newUser.email, subject, html);
        res.status(200).json({ code: 200, message: 'Tạo tài khoản thành công và email xác thực đã được gửi' });
    } catch (err) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(err);
    }
};

// Get list of all users controller
export const getAllUserController = async (req, res) => {
    try {
        let { limit, page, search } = req.query;
        if (!limit) limit = 5;
        if (!page) page = 1;
        const skip = (page - 1) * limit;

        let users = await User.find(
            search
                ? {
                      $or: [
                          { fullName: { $regex: search, $options: 'i' } },
                          { email: { $regex: search, $options: 'i' } },
                          { phoneNumber: { $regex: search, $options: 'i' } },
                      ],
                  }
                : {},
        )
            .select('-password -refreshTokens')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        let allUsers = await User.find(
            search
                ? {
                      $or: [
                          { fullName: { $regex: search, $options: 'i' } },
                          { email: { $regex: search, $options: 'i' } },
                          { phoneNumber: { $regex: search, $options: 'i' } },
                      ],
                  }
                : {},
        ).select('-password -refreshTokens');

        users = users.filter((item) => item.role !== 'Admin');
        allUsers = allUsers.filter((item) => item.role !== 'Admin');

        res.status(200).json({ code: 200, data: users, allUsers: allUsers });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get user by ID controller
export const getUserByIdController = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ code: 404, message: 'Không tìm thấy người dùng' });
        res.status(200).json({ code: 200, data: user });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Update user controller
export const updateUserController = async (req, res) => {
    try {
        const updatedProps = {
            email: req.body.email,
            fullName: req.body.fullName,
            gender: req.body.gender,
            birthDate: req.body.birthDate,
            phoneNumber: req.body.phoneNumber,
            department: req.body.department,
        };

        try {
            await User.findByIdAndUpdate(req.params.userId, updatedProps, {
                new: true,
            });
            res.status(200).json({ code: 200, message: 'Thông tin người dùng đã được cập nhật' });
        } catch (error) {
            res.status(400).json({ code: 400, message: 'Unexpected error' });
            console.log(error);
        }
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Update role controller
export const updateRoleController = async (req, res) => {
    try {
        // const tasks = await Task.find({});
        // const userTasks = tasks?.filter((t) =>
        //     t.assignTo.find((u) => {
        //         return u.value === req.params.userId;
        //     }),
        // );
        // const isHaveInProgressTasks = userTasks?.filter((item) => item.progress !== 'Hoàn thành');
        // if (isHaveInProgressTasks.length !== 0) {
        //     res.status(400).json({
        //         code: 400,
        //         message: 'Không thể thay đổi vai trò do người dùng có công việc chưa hoàn thành',
        //     });
        // } else {
        //     if (req.body.role !== 'Moderator' && req.body.role !== 'Member') {
        //         return res.status(400).json({ code: 400, message: 'Vai trò không hợp lệ' });
        //     }
        //     await User.findByIdAndUpdate(req.params.userId, { $set: { role: req.body.role } }, { new: true });
        //     return res.status(200).json({ code: 200, message: 'Thay đổi vai trò thành công' });
        // }
        if (req.body.role !== 'Moderator' && req.body.role !== 'Member') {
            return res.status(400).json({ code: 400, message: 'Vai trò không hợp lệ' });
        }
        await User.findByIdAndUpdate(req.params.userId, { $set: { role: req.body.role } }, { new: true });
        return res.status(200).json({ code: 200, message: 'Thay đổi vai trò thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Activate user controller
export const activateUserController = async (req, res) => {
    try {
        const isActived = req.body.isActived;
        await User.findByIdAndUpdate(req.params.userId, { $set: { isActived: isActived } });
        if (isActived === true) {
            res.status(200).json({ code: 200, message: 'Tài khoản người dùng đã được kích hoạt' });
        } else {
            res.status(200).json({ code: 200, message: 'Tài khoản người dùng đã bị vô hiệu hóa' });
        }
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Change password controller
export const changePasswordController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false) {
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        }

        // Old password from frontend
        const oldPassword = req.body.oldPassword;
        // Check old password from frontend is the same of password in db
        const isCorrect = await bcrypt.compare(oldPassword, currentUser.password);
        if (!isCorrect) {
            return res.status(400).json({
                code: 400,
                message: 'Mật khẩu cũ không chính xác',
            });
        }

        // New password from frontend
        const newPassword = req.body.newPassword;
        // Check new password conflict with password in db
        const isConflict = await bcrypt.compare(currentUser.password, newPassword);
        if (isConflict) {
            res.status(400).json({
                code: 400,
                message: 'Đây là mật khẩu hiện tại của bạn',
            });
        } else {
            const salt = bcrypt.genSaltSync(10);
            const newPasswordHashed = bcrypt.hashSync(newPassword, salt);

            await User.findByIdAndUpdate(req.user._id, { $set: { password: newPasswordHashed } }, { new: true });
            res.status(200).json({
                code: 200,
                message: 'Thay đổi mật khẩu thành công',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: 'Unexpected error' });
    }
};

// Change avatar controller
export const changeAvatarController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });

        const file = req.file;
        if (!file) return res.status(500).json({ code: 500, message: 'Internal server error' });

        const fileUrl = process.env.BASE_URL + `/static/${file.filename}`;
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $set: { avatar: fileUrl } });

        res.status(200).json({ code: 200, message: 'Thay đổi ảnh đại diện thành công', fileName: file.filename });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Remove avatar controller
export const removeAvatar = async (req, res) => {
    const directoryPath = 'uploads/';
    const fileName = req.params.name;
    const userId = req.user._id;

    fs.unlink(directoryPath + fileName, async (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ code: 500, message: 'Không thể xóa ảnh đại diện' });
        }

        await User.findByIdAndUpdate(userId, { $set: { avatar: '' } });
        res.status(200).json({ code: 200, message: 'Đã xóa ảnh đại diện thành công' });
    });
};

// Delete user permanently controller
export const deleteUserController = async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (user.role === 'Admin') {
        res.status(403).json({
            code: 403,
            message: 'Bạn không thể xóa tài khoản quản trị viên',
        });
    } else {
        try {
            await User.findByIdAndDelete(req.params.userId);
            res.status(200).json({
                code: 200,
                message: 'Người dùng đã bị xóa vĩnh viễn',
            });
        } catch (error) {
            res.status(400).json({ code: 400, message: 'Unexpected error' });
            console.log(error);
        }
    }
};

// Delete many users permanently controller
export const deleteManyUserController = async (req, res) => {
    try {
        const arrayId = req.body.arrayId;
        await User.deleteMany({ _id: arrayId });
        res.status(200).json({
            code: 200,
            message: 'Những người dùng được chọn đã bị xóa vĩnh viễn',
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get some public infomation of all users controller
export const getPublicInfoController = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 }).select('fullName avatar role department createdAt');
        res.status(200).json({ code: 200, message: 'Lấy thông tin công khai của user thành công', data: users });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Change req change info status controller
export const changeReqInfoStatusController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const isReqChangeInfo = req.body.isReqChangeInfo;
        await User.findByIdAndUpdate(userId, { $set: { isReqChangeInfo: isReqChangeInfo } }, { new: true });
        res.status(200).json({ code: 200, message: 'Thành công' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};
