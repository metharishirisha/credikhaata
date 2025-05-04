const Customer = require('../models/Customer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Get all customers
// @route   GET /api/v1/customers
// @access  Private
exports.getCustomers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single customer
// @route   GET /api/v1/customers/:id
// @access  Private
exports.getCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id).populate({
    path: 'loans',
    select: 'amount description dueDate status',
  });

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is customer owner
  if (customer.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User not authorized to access this customer`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: customer,
  });
});

// @desc    Create customer
// @route   POST /api/v1/customers
// @access  Private
exports.createCustomer = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const customer = await Customer.create(req.body);

  res.status(201).json({
    success: true,
    data: customer,
  });
});

// @desc    Update customer
// @route   PUT /api/v1/customers/:id
// @access  Private
exports.updateCustomer = asyncHandler(async (req, res, next) => {
  let customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is customer owner
  if (customer.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User not authorized to update this customer`,
        401
      )
    );
  }

  customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: customer,
  });
});

// @desc    Delete customer
// @route   DELETE /api/v1/customers/:id
// @access  Private
exports.deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is customer owner
  if (customer.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User not authorized to delete this customer`,
        401
      )
    );
  }

  await customer.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});