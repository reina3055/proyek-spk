import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js'; // Asumsi nama middleware loginmu verifyToken
import { isSuperAdmin } from '../middleware/authMiddleware.js';
import { getAllAdmins, resetAdminPassword } from '../controllers/userController.js';

const router = express.Router();

// Hanya Super Admin yang login yang bisa akses
router.get('/admins', verifyToken, isSuperAdmin, getAllAdmins);
router.put('/admins/:id/reset-password', verifyToken, isSuperAdmin, resetAdminPassword);

export default router;