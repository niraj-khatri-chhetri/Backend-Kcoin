import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  senderAddress: String,
  recipientAddress: String,
  amount: Number,
  timestamp: Number,
});

const BlockSchema = new mongoose.Schema({
  index: Number,
  timestamp: Number,
  transactions: [TransactionSchema],
  previousHash: String,
  hash: String,
  nonce: Number,
});

export const Block = mongoose.model('Block', BlockSchema);
