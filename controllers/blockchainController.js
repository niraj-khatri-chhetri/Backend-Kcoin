import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import { Block } from '../models/Block.js';
import ErrorHandler from '../utils/errorhandler.js';
import { PendingTransaction } from '../models/PendingTransaction.js';
import { mineBlock } from '../blockchain/mineBlock.js';

export const fetchBlockchain = catchAsyncErrors(async (req, res, next) => {
  const chain = await Block.find().sort({ index: 1 });
  res.status(200).json({
    success: true,
    message: 'Blockchain fetched successfully',
    chain,
  });
});

export const fetchBlock = catchAsyncErrors(async (req, res, next) => {
  const { blockId } = req.params;

  const block = await Block.findById(blockId);

  if (!block) {
    return next(new ErrorHandler('No block found', 400));
  }

  return res.status(200).json({
    success: true,
    message: 'Block fetched successfully',
    block,
  });
});

export const mineNewBlock = catchAsyncErrors(async (req, res) => {
  console.log('🚀 ~ req.user:', req?.user);
  const minerAddress = req?.user?.walletAddress;
  console.log('🚀 ~ minerAddress:', minerAddress);

  const pendingTxs = await PendingTransaction.find();
  const lastBlock = await Block.findOne().sort({ index: -1 });

  if (pendingTxs.length === 0 && lastBlock) {
    return res.status(400).json({
      message: 'No pending transactions to mine',
    });
  }

  //Coinbase reward transaction
  const rewardTx = {
    senderAddress: '00',
    recipientAddress: minerAddress,
    amount: 10,
    timestamp: Date.now(),
  };

  const transactions = lastBlock ? [rewardTx, ...pendingTxs] : [rewardTx];

  const index = lastBlock ? lastBlock.index + 1 : 0;
  const previousHash = lastBlock ? lastBlock.hash : '0';

  const { nonce, hash, difficulty } = mineBlock({
    index,
    previousHash,
    timestamp: Date.now(),
    transactions,
  });

  const newBlock = await Block.create({
    index,
    timestamp: Date.now(),
    transactions,
    previousHash: previousHash,
    hash,
    nonce,
  });

  // Clear pending only if they existed
  if (pendingTxs.length > 0) {
    await PendingTransaction.deleteMany();
  }

  res.status(201).json({
    success: true,
    message: lastBlock
      ? 'New block mined successfully'
      : 'Genesis block mined successfully',
    block: newBlock,
    difficulty,
  });
});
// export const mineNewBlock = catchAsyncErrors(async (req, res) => {
//   const block = await mineBlock(req.user.walletAddress);
//   res.status(200).json({
//     success: true,
//     message: 'New block mined successfully',
//     block,
//   });
// });
