import { Router } from 'express';
import { createTaskTypeController, getAllTaskTypeController } from '../controllers/task-type-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isMember, isModerator } from '../middlewares/role.js';

const router = Router();

router.post('/create', verifyToken, isModerator, createTaskTypeController);

router.get('/get-all', verifyToken, isMember, getAllTaskTypeController);

export default router;
