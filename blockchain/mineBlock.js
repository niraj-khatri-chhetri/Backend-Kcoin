import crypto from 'crypto';
import { getDifficulty } from './getDifficulty.js';

function calculateHash(index, timestamp, transactions, previousHash, nonce) {
  return crypto
    .createHash('sha256')
    .update(
      index + timestamp + JSON.stringify(transactions) + previousHash + nonce
    )
    .digest('hex');
}

export const mineBlock = ({ index, previousHash, timestamp, transactions }) => {
  const difficulty = getDifficulty(index);
  console.log('🚀 ~ mineBlock ~ difficulty:', difficulty);
  const targetPrefix = '0'.repeat(difficulty);
  console.log('🚀 ~ mineBlock ~ targetPrefix:', targetPrefix);

  let nonce = 0;
  let hash = '';

  do {
    nonce++;
    hash = calculateHash(index, timestamp, transactions, previousHash, nonce);
  } while (!hash.startsWith(targetPrefix));

  return {
    nonce,
    hash,
    difficulty,
  };
};
