import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isMember, isModerator } from '../middlewares/role.js';
import {
    createDocumentTypeController,
    getAllDocumentTypeController,
} from '../controllers/document-type-controllers.js';

const router = Router();

// Create document type route
router.post('/create', verifyToken, isModerator, createDocumentTypeController);

// Get all document types route
router.get('/get-all', verifyToken, isMember, getAllDocumentTypeController);

export default router;
