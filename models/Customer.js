const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide customer name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide customer phone number'],
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Please provide a valid 10-digit phone number',
    },
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters'],
  },
  trustScore: {
    type: Number,
    default: 50,
    min: [0, 'Trust score cannot be less than 0'],
    max: [100, 'Trust score cannot exceed 100'],
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

module.exports = mongoose.model('Customer', customerSchema);