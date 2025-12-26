import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import { Block } from '../models/Block.js';

import { getBalance } from '../blockchain/getBalance.js';

export const fetchWallet = catchAsyncErrors(async (req, res, next) => {
  const address = req.user.walletAddress;
  // const blocks = await Block.find();

  // let balance = 0;
  // blocks.forEach((block) => {
  //   block.transactions.forEach((tx) => {
  //     if (tx.senderAddress === address) balance -= tx.amount;
  //     if (tx.recipientAddress === address) balance += tx.amount;
  //   });
  // });

  const balance = await getBalance(address);

  res.status(200).json({
    walletAddress: address,
    balance,
    success: true,
    message: 'Wallet fetched successfully',
  });
});
