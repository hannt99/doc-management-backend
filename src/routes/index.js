import { Router } from 'express';
import authRoutes from './auth-routes.js';
// import userRoutes from './user-routes.js';
// import videoRoutes from './video-routes.js';
// import commentRoutes from './comment-routes.js';
// import notificationRoutes from './notification-routes.js';

const router = Router();

router.use('/auth', authRoutes);
// router.use("/user", userRoutes);
// router.use("/video", videoRoutes);
// router.use('/comment', commentRoutes);
// router.use('/notification', notificationRoutes);

export default router;
