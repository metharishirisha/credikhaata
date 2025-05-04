const mongoose = require('mongoose');
const moment = require('moment');

const loanSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 1 },
  description: { type: String, trim: true, maxlength: 200 },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

loanSchema.pre('save', function (next) {
  if (this.isModified('dueDate')) {
    if (new Date(this.dueDate) < new Date() && this.status !== 'paid') {
      this.status = 'overdue';
    }
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);