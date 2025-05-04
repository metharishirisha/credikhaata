const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please provide repayment amount'],
    min: [1, 'Repayment amount must be at least 1'],
  },
  loan: {
    type: mongoose.Schema.ObjectId,
    ref: 'Loan',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Repayment', repaymentSchema);