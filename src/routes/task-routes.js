import { Router } from 'express';
import {
    createTaskController,
    uploadFileController,
    deleteFileUrlController,
    getAllTaskController,
    getTaskByIdController,
    updateTaskController,
    updateTaskProgressController,
    undoTaskController,
    deleteTaskController,
    deleteManyTaskController,
    uploadResourceController,
    changeAssignRoleController,
    deleteSubmitFileUrlController,
    changeSubmitStatusController,
} from '../controllers/task-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isMember, isModerator } from '../middlewares/role.js';
import upload from '../utils/uploadFile.js';

const router = Router();

// Create task route
router.post('/create', verifyToken, isModerator, createTaskController);

// Get all tasks route
router.get('/get-all', verifyToken, isMember, getAllTaskController);

// Get task by ID route
router.get('/get/:taskId', verifyToken, isMember, getTaskByIdController);

// Upload file route
router.post('/upload/:taskId', verifyToken, isModerator, upload.array('myFile', 10), uploadFileController);

// Delete file url route
router.patch('/delete-file-url/:taskId', verifyToken, isModerator, deleteFileUrlController);

// Update task route
router.put('/update/:taskId', verifyToken, isModerator, updateTaskController);

// Update task progress route
router.patch('/update-progress/:taskId', verifyToken, isMember, updateTaskProgressController);

// Undo task route
router.patch('/undo/:taskId', verifyToken, isMember, undoTaskController);

// Delete task route
router.delete('/delete/:taskId', verifyToken, isModerator, deleteTaskController);

// Delete many tasks route
router.post('/delete-many', verifyToken, isModerator, deleteManyTaskController);

// Submit resource route
router.post('/submit/:taskId', verifyToken, isMember, upload.array('myFile', 10), uploadResourceController);

// unSubmit resource route
router.patch('/un-submit/:taskId', verifyToken, isMember, changeSubmitStatusController);

// Delete submit file url route
router.patch('/delete-submit-file-url/:taskId', verifyToken, isMember, deleteSubmitFileUrlController);      

// Change role of assignee route
router.patch('/change-assignee-role/:taskId', verifyToken, isModerator, changeAssignRoleController);

export default router;
