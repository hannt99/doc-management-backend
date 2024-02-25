import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isMember, isModerator } from '../middlewares/role.js';
import upload from '../utils/uploadFile.js';
import {
    createTaskController,
    getAllTaskController,
    getTaskByIdController,
    updateTaskController,
    uploadFileController,
    deleteFileUrlController,
    updateTaskProgressController,
    changeAssignRoleController,
    undoTaskController,
    uploadResourceController,
    deleteSubmitFileUrlController,
    changeSubmitStatusController,
    deleteTaskController,
    deleteManyTaskController,
} from '../controllers/task-controllers.js';
const router = Router();

// Create task route
router.post('/create', verifyToken, isModerator, createTaskController);

// Get all tasks route
router.get('/get-all', verifyToken, isMember, getAllTaskController);

// Get task by ID route
router.get('/get/:taskId', verifyToken, isMember, getTaskByIdController);

// Update task route
router.put('/update/:taskId', verifyToken, isModerator, updateTaskController);

// Upload file route (Upload file of task)
router.post('/upload/:taskId', verifyToken, isModerator, upload.array('myFile', 10), uploadFileController);

// Delete file url route (Delete attack file of task)
router.patch('/delete-file-url/:taskId', verifyToken, isModerator, deleteFileUrlController);

// Update task progress route
router.patch('/update-progress/:taskId', verifyToken, isMember, updateTaskProgressController);

// Change role of assignee route
router.patch('/change-assignee-role/:taskId', verifyToken, isModerator, changeAssignRoleController);

// Undo task route
router.patch('/undo/:taskId', verifyToken, isMember, undoTaskController);

// Submit resource route
router.post('/submit/:taskId', verifyToken, isMember, upload.array('myFile', 10), uploadResourceController);

// Un-submit resource route
router.patch('/un-submit/:taskId', verifyToken, isMember, changeSubmitStatusController);

// Delete submit file url route
router.patch('/delete-submit-file-url/:taskId', verifyToken, isMember, deleteSubmitFileUrlController);

// Delete task route
router.delete('/delete/:taskId', verifyToken, isModerator, deleteTaskController);

// Delete many tasks route
router.post('/delete-many', verifyToken, isModerator, deleteManyTaskController);

export default router;
