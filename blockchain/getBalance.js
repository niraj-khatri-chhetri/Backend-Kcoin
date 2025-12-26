import { Block } from '../models/Block.js';

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
