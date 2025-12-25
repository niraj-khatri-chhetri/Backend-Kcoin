import express from 'express';
import { isAuthenticatedUser } from '../middleware/auth.js';
import { fetchWallet } from '../controllers/walletController.js';

const router = express.Router();

router.get('/wallet', isAuthenticatedUser, fetchWallet);

export default router;
