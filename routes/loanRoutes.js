const express = require('express');
const {
  getLoans,
  getLoan,
  createLoan,
  updateLoan,
  deleteLoan,
  getLoanSummary,
  getOverdueLoans,
} = require('../controllers/loanController');

const router = express.Router();
const { protect } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const Loan = require('../models/Loan');

// Re-route into repayment router
const repaymentRouter = require('./repaymentRoutes');
router.use('/:loanId/repayments', repaymentRouter);

router
  .route('/')
  .get(protect, advancedResults(Loan, 'customer'), getLoans);

router
  .route('/:id')
  .get(protect, getLoan)
  .put(protect, updateLoan)
  .delete(protect, deleteLoan);

router
  .route('/summary')
  .get(protect, getLoanSummary);

router
  .route('/overdue')
  .get(protect, getOverdueLoans);

module.exports = router;