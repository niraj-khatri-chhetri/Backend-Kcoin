import { Block } from '../models/Block.js';
import { PendingTransaction } from '../models/PendingTransaction.js';

export const getBalance = async (walletAddress) => {
  let balance = 0;

  const blocks = await Block.find();

  blocks.forEach((block) => {
    block.transactions.forEach((transaction) => {
      if (transaction.recipientAddress === walletAddress)
        return (balance += transaction.amount);
      if (transaction.senderAddress === walletAddress)
        return (balance -= transaction.amount);
    });
  });

  return balance;
};

//From pending lists
export const calculatePendingOutgoing = async (senderAddress) => {
  const pendingTxs = await PendingTransaction.find({ senderAddress });

  let balance = pendingTxs.reduce((sum, tx) => sum + tx.amount, 0);

  return balance;
};
