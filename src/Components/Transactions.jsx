import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Transactions.css'; // Ensure to link the CSS

export const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('credit'); // Default type
    const [editingId, setEditingId] = useState(null); // State to track the editing transaction

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const addOrUpdateTransaction = async (e) => {
        e.preventDefault();
        if (editingId) {
            // Update existing transaction
            try {
                const response = await axios.put(`http://localhost:5000/api/transactions/${editingId}`, {
                    description,
                    amount,
                    type: transactionType,
                });
                setTransactions(transactions.map(transaction => (transaction._id === editingId ? response.data : transaction))); // Update in state
                setEditingId(null); // Reset editing ID
            } catch (error) {
                console.error('Error updating transaction:', error);
            }
        } else {
            // Add new transaction
            try {
                const response = await axios.post('http://localhost:5000/api/transactions', {
                    description,
                    amount,
                    type: transactionType,
                });
                setTransactions([response.data, ...transactions]); // Add new transaction to the top
            } catch (error) {
                console.error('Error adding transaction:', error);
            }
        }
        setDescription('');
        setAmount('');
        setTransactionType('credit'); // Reset to default type
    };

    const handleEdit = (transaction) => {
        setEditingId(transaction._id);
        setDescription(transaction.description);
        setAmount(transaction.amount);
        setTransactionType(transaction.type);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/transactions/${id}`);
            setTransactions(transactions.filter(transaction => transaction._id !== id)); // Remove deleted transaction from state
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    // Sort transactions from newest to oldest
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="transaction-container">
            <div className="transaction-input-box">
                <form className="transaction-inputs" onSubmit={addOrUpdateTransaction}>
                    <input
                        type="text"
                        placeholder="Transaction Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                    <button type="submit">{editingId ? 'Update Transaction' : 'Add Transaction'}</button>
                </form>
            </div>

            <h3 className="transaction-heading">Transactions</h3>

            <ul className="transaction-list">
                {sortedTransactions.map(transaction => (
                    <li key={transaction._id}>
                        {transaction.description}: ${transaction.amount} ({transaction.type})
                        <div className="transaction-buttons">
                            <button className="edit-button" onClick={() => handleEdit(transaction)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(transaction._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
