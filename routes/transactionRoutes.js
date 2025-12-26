import express from 'express';

import { isAuthenticatedUser } from '../middleware/auth.js';
import {
  createTransaction,
  fetchAllTransactions,
  fetchPendingTransactions,
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/transactions', isAuthenticatedUser, createTransaction);

router.get('/transactions', fetchAllTransactions);

router.get('/transactions/pending', fetchPendingTransactions);

export default router;
