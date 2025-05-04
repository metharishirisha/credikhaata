const express = require('express');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

const router = express.Router();
const { protect } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const Customer = require('../models/Customer');

// Re-route into loan router
const loanRouter = require('./loanRoutes');
router.use('/:customerId/loans', loanRouter);

router
  .route('/')
  .get(protect, advancedResults(Customer, 'loans'), getCustomers)
  .post(protect, createCustomer);

router
  .route('/:id')
  .get(protect, getCustomer)
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

module.exports = router;