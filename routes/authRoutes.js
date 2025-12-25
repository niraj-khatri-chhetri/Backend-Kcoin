import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { isAuthenticatedUser } from '../middleware/auth.js';
import { getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', isAuthenticatedUser, getMe);

export default router;
