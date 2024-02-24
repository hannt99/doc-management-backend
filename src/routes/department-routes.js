import { Router } from 'express';
import {
    getAllDepartmentController,
    createDepartmentController,
    getDepartmentByIdController,
    updateDepartmentController,
    activateDepartmentController,
    deleteDepartmentController,
    deleteManyDepartmentController,
} from '../controllers/department-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isMember, isModerator } from '../middlewares/role.js';

const router = Router();

// Create department route
router.post('/create', verifyToken, isModerator, createDepartmentController);

// Get all departments route
router.get('/get-all', verifyToken, isMember, getAllDepartmentController);

// Get department by ID route
router.get('/get/:departmentId', verifyToken, isModerator, getDepartmentByIdController);

// Update department info route
router.put('/update/:departmentId', verifyToken, isModerator, updateDepartmentController);

// Activate department route
router.patch('/activate/:departmentId', verifyToken, isModerator, activateDepartmentController);

// // Delete department route
router.delete('/delete/:departmentId', verifyToken, isModerator, deleteDepartmentController);

// // Delete many departments permanently route
router.post('/delete-many', verifyToken, isModerator, deleteManyDepartmentController);

export default router;
