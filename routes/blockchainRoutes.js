import express from 'express';
import { isAuthenticatedUser } from '../middleware/auth.js';
import { mineBlock } from '../blockchain/blockchain.js';
import { Block } from '../models/Block.js';

import {
  fetchBlockchain,
  mineNewBlock,
} from '../controllers/blockchainController.js';

const router = express.Router();

router.get('/chain', fetchBlockchain);

router.post('/mine', isAuthenticatedUser, mineNewBlock);

export default router;
