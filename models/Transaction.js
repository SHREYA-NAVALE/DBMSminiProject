// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true }, // Add transaction type
    date: { type: Date, default: Date.now }
});

transactionSchema.index({ date: -1 });
module.exports = mongoose.model('Transaction', transactionSchema);
