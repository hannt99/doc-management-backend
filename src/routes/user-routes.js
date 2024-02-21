import { Router } from 'express';
import {
    createUserController,
    getAllUserController,
    getUserByIdController,
    updateUserController,
    updateRoleController,
    activateUserController,
    changePasswordController,
    changeAvatarController,
    removeAvatar,
    deleteUserController,
    deleteManyUserController,
    getPublicInfoController,
    changeReqInfoStatusController,
} from '../controllers/user-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin, isMember } from '../middlewares/role.js';
import multer from 'multer';
import upload from '../utils/uploadFile.js';
import customLog from '../utils/customLog.js';

const router = Router();
const _upload = upload.single('myFile');

// Create user route
router.post('/create', verifyToken, isAdmin, createUserController);

// Get list of all users route
router.get('/get-all', verifyToken, isAdmin, getAllUserController);

// Get user by ID route
router.get('/get/:userId', verifyToken, isAdmin, getUserByIdController);

// Update user info route
router.put('/update/:userId', verifyToken, isAdmin, updateUserController);

// Update role route
router.patch('/update-role/:userId', verifyToken, isAdmin, updateRoleController);

// Activate user route
router.patch('/activate/:userId', verifyToken, isAdmin, activateUserController);

// Change password route
router.patch('/change-password', verifyToken, isMember, changePasswordController);

// Change avatar route
router.post(
    '/change-avatar',
    verifyToken,
    (req, res, next) => {
        // handle the case "myFile" is not present => throw File upload error
        _upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(400).json({ code: 400, message: 'File upload error' });
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(500).json({ code: 500, message: 'Internal server error' });
            }
            // Everything went fine.
            next();
        });
    },
    changeAvatarController,
);

// Remove avatar route
router.delete('/file/:name', verifyToken, removeAvatar);

// Delete user permanently route
router.delete('/delete/:userId', verifyToken, isAdmin, deleteUserController);

// Delete many users permanently route
router.post('/delete-many', verifyToken, isAdmin, deleteManyUserController);

// Get some public information of all users route
router.get('/public-info', verifyToken, getPublicInfoController);

// Change req change info status route
router.patch('/change-req-info-status/:userId', verifyToken, isMember, changeReqInfoStatusController);

export default router;
