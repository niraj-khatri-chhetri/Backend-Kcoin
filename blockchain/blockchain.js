import crypto from 'crypto';
import { Block } from '../models/Block.js';
import { pendingTransactions } from './pending.js';

import { PendingTransaction } from '../models/PendingTransaction.js';

const DIFFICULTY = '00';

function calculateHash(index, timestamp, transactions, previousHash, nonce) {
  return crypto
    .createHash('sha256')
    .update(
      index + timestamp + JSON.stringify(transactions) + previousHash + nonce
    )
    .digest('hex');
}

export async function mineBlock(minerAddress) {
  console.log('🚀 MINING STARTED BY THIS WALLET ADDRESS', minerAddress);

  const pendingTransactions = await PendingTransaction.find().sort({
    timestamp: 1,
  });
  console.log('🚀 ~ mineBlock ~ pendingTransactions:', pendingTransactions);

  if (pendingTransactions.length === 0) {
    throw new Error('No pending transactions to include in the block');
  }

  return;

  const lastBlock = await Block.findOne().sort({ index: -1 });

  const index = lastBlock ? lastBlock.index + 1 : 0;
  const previousHash = lastBlock ? lastBlock.hash : '0';

  const rewardTx = {
    senderAddress: '00',
    recipientAddress: minerAddress,
    amount: 10,
    timestamp: Date.now(),
  };

  const transactions = [...pendingTransactions, rewardTx];

  let nonce = 0;
  let hash = '';

  do {
    nonce++;
    hash = calculateHash(index, Date.now(), transactions, previousHash, nonce);
  } while (!hash.startsWith(DIFFICULTY));

  const block = await Block.create({
    index,
    timestamp: Date.now(),
    transactions,
    previousHash,
    hash,
    nonce,
  });

  //clear pending transactions pool
  pendingTransactions.length = 0;

  //return a NEWLY MINED BLOCK
  return block;
}
