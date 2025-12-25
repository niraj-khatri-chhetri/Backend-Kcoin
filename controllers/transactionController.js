import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import { pendingTransactions } from '../blockchain/pending.js';
import { Block } from '../models/Block.js';

import { User } from '../models/User.js';

import { PendingTransaction } from '../models/PendingTransaction.js';

export const createTransaction = catchAsyncErrors(async (req, res, next) => {
  const { recipientAddress, amount } = req.body;
  const sender = req.user.walletAddress;

  //check if recipient exists
  const recipientExists = await User.findOne({
    walletAddress: recipientAddress,
  });
  if (!recipientExists) {
    return res.status(400).json({
      success: false,
      message: 'Recipient wallet not found',
    });
  }

  const blocks = await Block.find();

  let balance = 0;

  //Iterating through the blockchain to calculate the sender's balance
  blocks.forEach((block) => {
    block.transactions.forEach((transaction) => {
      if (transaction.senderAddress === sender) {
        balance -= transaction.amount;
      }

      if (transaction.recipientAddress === sender) {
        balance += transaction.amount;
      }
    });
  });

  if (balance < amount) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient balance',
    });
  }

  // Saving the transaction to the pending transactions pool
  await PendingTransaction.create({
    senderAddress: sender,
    recipientAddress,
    amount,
  });

  res
    .status(200)
    .json({ message: 'Transaction added to pending pool', success: true });
});

export const fetchPendingTransactions = catchAsyncErrors(
  async (req, res, next) => {
    const pending = await PendingTransaction.find().sort({ timestamp: 1 });
    res.status(200).json({ success: true, pendingTransactions: pending });
  }
);
