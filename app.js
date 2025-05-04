const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Load env vars - should be at the VERY TOP before any other code
dotenv.config();

// Create express app
const app = express();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const loanRoutes = require('./routes/loanRoutes');
const repaymentRoutes = require('./routes/repaymentRoutes');

// Body parser
app.use(express.json());

// Enable CORS - consider configuring allowed origins for production
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/repayments', repaymentRoutes);

// Error handler middleware - should be after all other middleware/routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development'; // Added fallback

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});