import { Router } from 'express';
import {
    verifyController,
    signInController,
    forgotPasswordController,
    resetPasswordController,
    refreshController,
    getCurrentUserController,
    signOutController,
} from '../controllers/auth-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();

// Verify account route
router.get('/verify', verifyController);

// Sign in route
router.post('/sign-in', signInController);

// Forgot password route
router.post('/forgot-password', forgotPasswordController);

// Reset password route
router.post('/reset-password', resetPasswordController);

// Refresh token route
router.post('/refresh/:userId', refreshController);

// Get current user route
router.get('/current-user', verifyToken, getCurrentUserController);

// Sign out route
router.post('/sign-out', verifyToken, signOutController);

export default router;
