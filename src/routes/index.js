import { Router } from 'express';
import authRoutes from './auth-routes.js';
import userRoutes from './user-routes.js';
import reqChangeInfoRoutes from './req-change-info-routes.js';
import departmentRoutes from './department-routes.js';
import documentTypeRoutes from './document-type-routes.js';
import documentRoutes from './document-routes.js';
import taskTypeRoutes from './task-type-routes.js';
import taskRoutes from './task-routes.js';
import senderRoutes from './sender-routes.js';
import notificationRoutes from './notification-routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/req-change-info', reqChangeInfoRoutes);
router.use('/department', departmentRoutes);
router.use('/document-type', documentTypeRoutes);
router.use('/document', documentRoutes);
router.use('/task-type', taskTypeRoutes);
router.use('/task', taskRoutes);
router.use('/sender', senderRoutes);
router.use('/notification', notificationRoutes);

export default router;
