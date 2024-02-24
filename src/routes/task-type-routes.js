import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isMember, isModerator } from '../middlewares/role.js';
import { createTaskTypeController, getAllTaskTypeController } from '../controllers/task-type-controllers.js';

const router = Router();

router.post('/create', verifyToken, isModerator, createTaskTypeController);

router.get('/get-all', verifyToken, isMember, getAllTaskTypeController);

export default router;
