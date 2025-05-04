const Repayment = require('../models/Repayment');
const Loan = require('../models/Loan');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Get all repayments
// @route   GET /api/v1/repayments
// @route   GET /api/v1/loans/:loanId/repayments
// @access  Private
exports.getRepayments = asyncHandler(async (req, res, next) => {
  if (req.params.loanId) {
    const repayments = await Repayment.find({
      loan: req.params.loanId,
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,
      count: repayments.length,
      data: repayments,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single repayment
// @route   GET /api/v1/repayments/:id
// @access  Private
exports.getRepayment = asyncHandler(async (req, res, next) => {
  const repayment = await Repayment.findById(req.params.id).populate({
    path: 'loan',
    select: 'amount description',
  });

  if (!repayment) {
    return next(
      new ErrorResponse(`Repayment not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is repayment owner
  if (repayment.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to access this repayment`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: repayment,
  });
});

// @desc    Create repayment
// @route   POST /api/v1/loans/:loanId/repayments
// @access  Private
exports.createRepayment = asyncHandler(async (req, res, next) => {
  req.body.loan = req.params.loanId;
  req.body.user = req.user.id;

  const loan = await Loan.findById(req.params.loanId);

  if (!loan) {
    return next(
      new ErrorResponse(`Loan not found with id of ${req.params.loanId}`, 404)
    );
  }

  // Make sure user is loan owner
  if (loan.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User not authorized to add a repayment to this loan`,
        401
      )
    );
  }

  const repayment = await Repayment.create(req.body);

  // Update loan status if fully paid
  // This is a simplified version - you might want to track total repaid amount
  if (repayment.amount >= loan.amount) {
    await Loan.findByIdAndUpdate(req.params.loanId, { status: 'paid' });
  }

  res.status(201).json({
    success: true,
    data: repayment,
  });
});

// @desc    Update repayment
// @route   PUT /api/v1/repayments/:id
// @access  Private
exports.updateRepayment = asyncHandler(async (req, res, next) => {
  let repayment = await Repayment.findById(req.params.id);

  if (!repayment) {
    return next(
      new ErrorResponse(`Repayment not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is repayment owner
  if (repayment.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to update this repayment`, 401)
    );
  }

  repayment = await Repayment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: repayment,
  });
});

// @desc    Delete repayment
// @route   DELETE /api/v1/repayments/:id
// @access  Private
exports.deleteRepayment = asyncHandler(async (req, res, next) => {
  const repayment = await Repayment.findById(req.params.id);

  if (!repayment) {
    return next(
      new ErrorResponse(`Repayment not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is repayment owner
  if (repayment.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to delete this repayment`, 401)
    );
  }

  await repayment.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});