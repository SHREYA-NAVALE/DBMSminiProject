// routes/budgets.js
const express = require('express');
const Budget = require('../models/Budget'); // Make sure you have this model defined
const router = express.Router();

// GET all budgets
router.get('/', async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new budget
router.post('/', async (req, res) => {
    const budget = new Budget({
        name: req.body.name,
        amount: req.body.amount,
        date: req.body.date,
    });

    try {
        const savedBudget = await budget.save();
        res.status(201).json(savedBudget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT to update a budget
router.put('/:id', async (req, res) => {
    const { name, amount } = req.body;
    try {
        const updatedBudget = await Budget.findByIdAndUpdate(
            req.params.id,
            { name, amount },
            { new: true } // Return the updated budget
        );
        if (!updatedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json(updatedBudget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a budget
router.delete('/:id', async (req, res) => {
    try {
        const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
        if (!deletedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.status(200).json({ message: 'Budget deleted', budget: deletedBudget });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
