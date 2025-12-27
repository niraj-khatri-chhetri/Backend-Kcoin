import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import { Block } from '../models/Block.js';

import { User } from '../models/User.js';

import { PendingTransaction } from '../models/PendingTransaction.js';
import { getBalance } from '../blockchain/getBalance.js';

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

  const balance = await getBalance(sender);

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

export const fetchAllTransactions = catchAsyncErrors(async (req, res, next) => {
  const blocks = await Block.find(
    {},
    { transactions: 1, index: 1, hash: 1, _id: 0 }
  );

  const transactions = blocks.flatMap((block) =>
    block.transactions.map((tx) => ({
      ...tx.toObject(),
      blockIndex: block.index,
      blockHash: block.hash,
    }))
  );

  res.status(200).json({
    success: true,
    totalTransactions: transactions.length,
    transactions,
  });
});

export const fetchPendingTransactions = catchAsyncErrors(
  async (req, res, next) => {
    const pending = await PendingTransaction.find().sort({ timestamp: 1 });
    res.status(200).json({ success: true, pendingTransactions: pending });
  }
);
