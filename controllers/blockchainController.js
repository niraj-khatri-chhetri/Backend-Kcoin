import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import { Block } from '../models/Block.js';
import { mineBlock } from '../blockchain/blockchain.js';

export const fetchBlockchain = catchAsyncErrors(async (req, res, next) => {
  const chain = await Block.find().sort({ index: 1 });
  res.status(200).json({
    success: true,
    message: 'Blockchain fetched successfully',
    chain,
  });
});

export const mineNewBlock = catchAsyncErrors(async (req, res) => {
  const block = await mineBlock(req.user.walletAddress);
  res.status(200).json({
    success: true,
    message: 'New block mined successfully',
    block,
  });
});
