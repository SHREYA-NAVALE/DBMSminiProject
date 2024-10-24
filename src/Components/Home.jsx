import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Home.css'; // Link to the CSS file

export const Home = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await fetch('http://localhost:5000/api/transactions');
            const data = await response.json();
            setTransactions(data);

            // Calculate the total balance as credit minus debit
            const totalBalance = data.reduce((acc, transaction) => {
                if (transaction.type === 'credit') {
                    return acc + parseFloat(transaction.amount);
                } else if (transaction.type === 'debit') {
                    return acc - parseFloat(transaction.amount);
                }
                return acc;
            }, 0);
            setBalance(totalBalance);
        };

        fetchTransactions();
    }, []);

    // Function to navigate to the Transactions page
    const handleAddTransaction = () => {
        navigate('/transactions'); // Redirect to the Transactions page
    };

    // Sort transactions from newest to oldest
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="home-container">
            <div className="balance-box">
                <h2>Available Balance</h2>
                <h1>${balance.toFixed(2)}</h1> {/* Large and centered */}
            </div>

            <div className="transaction-list-box">
                <h3>Recent Transactions</h3>
                <ul className="transaction-list">
                    {sortedTransactions.slice(0, 5).map(transaction => (
                        <li key={transaction._id}>
                            {transaction.description}: ${transaction.amount} ({transaction.type})
                        </li>
                    ))}
                </ul>

                {/* Add Transaction Button */}
                <button className="add-transaction-button" onClick={handleAddTransaction}>
                    Add Transaction
                </button>
            </div>
        </div>
    );
};
