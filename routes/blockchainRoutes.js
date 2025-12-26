import express from 'express';
import { isAuthenticatedUser } from '../middleware/auth.js';

import {
  fetchBlockchain,
  mineNewBlock,
  fetchBlock,
} from '../controllers/blockchainController.js';

const router = express.Router();

router.get('/chain', fetchBlockchain);
router.get('/chain/:blockId', fetchBlock);

router.post('/mine', isAuthenticatedUser, mineNewBlock);

export default router;
