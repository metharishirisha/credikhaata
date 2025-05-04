const express = require('express');
const {
  getRepayments,
  getRepayment,
  createRepayment,
  updateRepayment,
  deleteRepayment,
} = require('../controllers/repaymentController');

const router = express.Router();
const { protect } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const Repayment = require('../models/Repayment');

router
  .route('/')
  .get(protect, advancedResults(Repayment, 'loan'), getRepayments)
  .post(protect, createRepayment);

router
  .route('/:id')
  .get(protect, getRepayment)
  .put(protect, updateRepayment)
  .delete(protect, deleteRepayment);

module.exports = router;