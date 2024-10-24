import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from 'react';
import axios from 'axios';

export const Dashboard = () => {
    const { user } = useUser();
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchBudgetsAndTransactions = async () => {
            try {
                const [budgetsResponse, transactionsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/budgets'),
                    axios.get('http://localhost:5000/api/transactions')
                ]);

                setBudgets(budgetsResponse.data);
                setTransactions(transactionsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchBudgetsAndTransactions();
    }, []);

    // Calculate remaining budget for each budget item
    const calculateRemainingBudget = (budget) => {
        // Sum the amounts of transactions that match the budget's category
        const totalSpent = transactions
            .filter(transaction => transaction.category === budget.name) // Ensure transaction category matches the budget name
            .reduce((total, transaction) => total + (transaction.type === 'debit' ? transaction.amount : 0), 0); // Only sum debits

        return budget.amount - totalSpent; // Calculate remaining budget
    };

    return (
        <div>
            <h2>Hello {user?.firstName}!! Here are your Finances...</h2>
            <h3>Your Budgets:</h3>
            <ul>
                {budgets.map(budget => {
                    const remainingBudget = calculateRemainingBudget(budget);
                    return (
                        <li key={budget._id}>
                            {budget.name}: ${budget.amount} - Remaining: ${remainingBudget >= 0 ? remainingBudget : 0}
                        </li>
                    ); // Show remaining budget, ensuring it's not negative
                })}
            </ul>
            {/* <h3>Your Transactions:</h3> */}
            {/* <ul>
                {transactions.map(transaction => (
                    <li key={transaction._id}>
                        {transaction.description}: ${transaction.amount} ({transaction.category})
                    </li>
                ))}
            </ul> */}
        </div>
    );
};
