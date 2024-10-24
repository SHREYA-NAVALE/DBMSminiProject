const express = require('express');
const Transaction = require('../models/Transaction'); // Adjust path as needed
const router = express.Router();

// GET all transactions, sorted by date using aggregation
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.aggregate([
            { $sort: { date: -1 } } // Sort by date in descending order (newest to oldest)
        ]);
        res.json(transactions);
    } catch (error) {
        res.status(500).send('Error fetching transactions');
    }
});


// GET total balance (credit minus debit) using aggregation
router.get('/balance', async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            {
                $group: {
                    _id: null, // Group all documents
                    totalCredit: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0]
                        }
                    },
                    totalDebit: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    totalBalance: { $subtract: ["$totalCredit", "$totalDebit"] } // Calculate total balance
                }
            }
        ]);

        const totalBalance = result.length > 0 ? result[0].totalBalance : 0;
        res.json({ totalBalance });
    } catch (error) {
        res.status(500).send('Error calculating total balance');
    }
});

// GET total balance using mapReduce
router.get('/balance', async (req, res) => {
    try {
        const mapFunction = function () {
            emit(this.type, this.amount); // Emit type (credit or debit) and the amount
        };

        const reduceFunction = function (key, values) {
            return Array.sum(values); // Sum the amounts for each type
        };

        const result = await Transaction.mapReduce({
            map: mapFunction,
            reduce: reduceFunction,
            out: { inline: 1 } // Output result inline, instead of saving to a collection
        });

        // Extract credit and debit totals from the result
        let totalCredit = 0;
        let totalDebit = 0;
        result.forEach(item => {
            if (item._id === 'credit') totalCredit = item.value;
            if (item._id === 'debit') totalDebit = item.value;
        });

        const totalBalance = totalCredit - totalDebit; // Calculate the total balance
        res.json({ totalBalance });
        res.send(totalBalance)
    } catch (error) {
        res.status(500).send('Error calculating total balance');
    }
});

// POST a new transaction
// routes/transactions.js

// POST a new transaction
router.post('/', async (req, res) => {
    const { description, amount, type } = req.body; // Include type (credit/debit)
    const transaction = new Transaction({ description, amount, type });

    try {
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).send('Error adding transaction');
    }
});


// DELETE a transaction
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).send('Error deleting transaction');
    }
});

// PUT to update a transaction
router.put('/:id', async (req, res) => {
    const { description, amount } = req.body;
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id, 
            { description, amount }, 
            { new: true }
        );
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).send('Error updating transaction');
    }
});


// Export the router
module.exports = router;
