import { Block } from '../models/Block.js';
import crypto from 'crypto';

export async function createGenesisBlock() {
  const exists = await Block.findOne();
  if (exists) return;

  const genesisData = {
    index: 0,
    timestamp: Date.now(),
    transactions: [],
    previousHash: '0',
    nonce: 0,
  };

  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(genesisData))
    .digest('hex');

  await Block.create({ ...genesisData, hash });
}
