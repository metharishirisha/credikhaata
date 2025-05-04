const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const moment = require('moment');

// @desc    Get all loans
// @route   GET /api/v1/loans
// @route   GET /api/v1/customers/:customerId/loans
// @access  Private
exports.getLoans = asyncHandler(async (req, res, next) => {
  if (req.params.customerId) {
    const loans = await Loan.find({
      customer: req.params.customerId,
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,
      count: loans.length,
      data: loans,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single loan
// @route   GET /api/v1/loans/:id
// @access  Private
exports.getLoan = asyncHandler(async (req, res, next) => {
  const loan = await Loan.findById(req.params.id).populate({
    path: 'customer',
    select: 'name phone',
  });

  if (!loan) {
    return next(
      new ErrorResponse(`Loan not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is loan owner
  if (loan.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to access this loan`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: loan,
  });
});

// @desc    Create loan
// @route   POST /api/v1/customers/:customerId/loans
// @access  Private
exports.createLoan = asyncHandler(async (req, res, next) => {
  req.body.customer = req.params.customerId;
  req.body.user = req.user.id;

  const customer = await Customer.findById(req.params.customerId);

  if (!customer) {
    return next(
      new ErrorResponse(
        `Customer not found with id of ${req.params.customerId}`,
        404
      )
    );
  }

  // Make sure user is customer owner
  if (customer.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User not authorized to add a loan to this customer`,
        401
      )
    );
  }

  const loan = await Loan.create(req.body);

  res.status(201).json({
    success: true,
    data: loan,
  });
});

// @desc    Update loan
// @route   PUT /api/v1/loans/:id
// @access  Private
exports.updateLoan = asyncHandler(async (req, res, next) => {
  let loan = await Loan.findById(req.params.id);

  if (!loan) {
    return next(
      new ErrorResponse(`Loan not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is loan owner
  if (loan.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to update this loan`, 401)
    );
  }

  loan = await Loan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: loan,
  });
});

// @desc    Delete loan
// @route   DELETE /api/v1/loans/:id
// @access  Private
exports.deleteLoan = asyncHandler(async (req, res, next) => {
  const loan = await Loan.findById(req.params.id);

  if (!loan) {
    return next(
      new ErrorResponse(`Loan not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is loan owner
  if (loan.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to delete this loan`, 401)
    );
  }

  await loan.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get loan summary
// @route   GET /api/v1/loans/summary
// @access  Private
exports.getLoanSummary = asyncHandler(async (req, res, next) => {
  const loans = await Loan.find({ user: req.user.id });
  
  const totalLoaned = loans.reduce((acc, loan) => acc + loan.amount, 0);
  
  // Calculate total collected (you would need to implement this based on your repayment model)
  const totalCollected = 0; // Placeholder - implement based on your repayment tracking
  
  // Calculate overdue loans
  const overdueLoans = loans.filter(loan => 
    loan.status === 'overdue' || 
    (loan.status === 'pending' && moment(loan.dueDate).isBefore(moment()))
  );
  
  const overdueAmount = overdueLoans.reduce((acc, loan) => acc + loan.amount, 0);
  
  res.status(200).json({
    success: true,
    data: {
      totalLoaned,
      totalCollected,
      overdueAmount,
      totalActiveLoans: loans.filter(loan => loan.status === 'pending').length,
      totalOverdueLoans: overdueLoans.length,
      totalPaidLoans: loans.filter(loan => loan.status === 'paid').length,
    }
  });
});

// @desc    Get overdue loans
// @route   GET /api/v1/loans/overdue
// @access  Private
exports.getOverdueLoans = asyncHandler(async (req, res, next) => {
  const loans = await Loan.find({
    user: req.user.id,
    $or: [
      { status: 'overdue' },
      { 
        status: 'pending',
        dueDate: { $lt: new Date() }
      }
    ]
  }).populate({
    path: 'customer',
    select: 'name phone'
  });

  res.status(200).json({
    success: true,
    count: loans.length,
    data: loans
  });
});