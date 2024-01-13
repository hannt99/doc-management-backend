import { Router } from 'express';
import {
    // signUpController,
    // verifyController,
    signInController,
    forgotPasswordController,
    resetPasswordController,
    // changePasswordController,
    signOutController,
    getCurrentUserController,
    refreshController
} from '../controllers/auth-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';


const router = Router();

// Sign up route
// router.post('/sign-up', signUpController);

// Verify account route
// router.get('/verify', verifyController);

// Sign in route
router.post('/sign-in', signInController);

// Forgot password route
router.post('/forgot-password', forgotPasswordController);

// Reset password route
router.post('/reset-password', resetPasswordController);

// Change password route
// router.post('/change-password', changePasswordController);

// Sign out route
router.post('/sign-out', verifyToken, signOutController);

// Get current user route
router.get('/current-user', verifyToken, getCurrentUserController);

// Refresh token route
router.post('/refresh/:userId', refreshController);

export default router;
