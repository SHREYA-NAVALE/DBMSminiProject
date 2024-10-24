const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/personal-finance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Define routes
const transactionsRouter = require('./routes/transactions');
const budgetsRouter = require('./routes/budgets');

// Use routers for transactions and budgets
app.use('/api/transactions', transactionsRouter);
app.use('/api/budgets', budgetsRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
