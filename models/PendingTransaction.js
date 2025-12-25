import mongoose from 'mongoose';

const PendingTransactionSchema = new mongoose.Schema({
  senderAddress: { type: String, required: true },
  recipientAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Number, default: Date.now },
});

export const PendingTransaction = mongoose.model(
  'PendingTransaction',
  PendingTransactionSchema
);
