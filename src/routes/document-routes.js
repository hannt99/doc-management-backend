import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isModerator, isMember } from '../middlewares/role.js';
import upload from '../utils/uploadFile.js';
import {
    createDocumentController,
    uploadFileController,
    deleteFileUrlController,
    getAllDocumentController,
    getDocumentByIdController,
    updateDocumentController,
    changeDocumentStatusController,
    changeDocumentLocationController,
    deleteDocumentController,
    deleteManyDocumentController,
} from '../controllers/document-controllers.js';

const router = Router();

// Create document route
router.post('/create', verifyToken, isModerator, createDocumentController);

// Get all document route
router.get('/get-all', verifyToken, isMember, getAllDocumentController);

// Get document by ID route
router.get('/get/:documentId', verifyToken, isMember, getDocumentByIdController);

// Update document route
router.put('/update/:documentId', verifyToken, isModerator, updateDocumentController);

// Upload file route
router.post('/upload/:documentId', verifyToken, isModerator, upload.array('myFile', 10), uploadFileController);

// Delete file url route
router.patch('/delete-file-url/:documentId', verifyToken, isModerator, deleteFileUrlController);

// Change document status route
router.patch('/change-status/:documentId', verifyToken, isModerator, changeDocumentStatusController);

// Change current document location route
router.patch('/change-location/:documentId', verifyToken, isModerator, changeDocumentLocationController);

// Delete document route
router.delete('/delete/:documentId', verifyToken, isModerator, deleteDocumentController);

// Delete many documents route
router.post('/delete-many', verifyToken, isModerator, deleteManyDocumentController);

export default router;
