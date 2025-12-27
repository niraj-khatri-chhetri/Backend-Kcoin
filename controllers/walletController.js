import catchAsyncErrors from '../middleware/catchAsyncErrors.js';

import { getBalance } from '../blockchain/getBalance.js';

export const fetchWallet = catchAsyncErrors(async (req, res, next) => {
  const address = req.user.walletAddress;

  const balance = await getBalance(address);

  res.status(200).json({
    walletAddress: address,
    balance,
    success: true,
    message: 'Wallet fetched successfully',
  });
});
