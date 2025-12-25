import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import { Block } from '../models/Block.js';
import { PendingTransaction } from '../models/PendingTransaction.js';
import { User } from '../models/User.js';

export const getNetworkStats = catchAsyncErrors(async (req, res, next) => {
  //Total blocks
  const blocksCount = await Block.countDocuments();

  //Total transactions in blockchain
  const blocks = await Block.find({}, { transactions: 1 });
  const transactionsCount = blocks.reduce((total, block) => {
    return total + block.transactions.length;
  }, 0);

  //pending transactions
  const pendingTransactionsCount = await PendingTransaction.countDocuments();

  //Total wallets
  const walletsCount = await User.countDocuments();

  res.status(200).json({
    success: true,
    message: 'Network stats fetched successfully',
    data: {
      blocks: blocksCount,
      transactions: transactionsCount,
      pendingTransactions: pendingTransactionsCount,
      wallets: walletsCount,
    },
  });
});
