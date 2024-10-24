import { useEffect, useState } from 'react';
import axios from 'axios';
import './Budgets.css'; // Ensure to link the CSS

export const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [editingId, setEditingId] = useState(null); // State to track the editing budget

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/budgets');
                setBudgets(response.data);
            } catch (error) {
                console.error('Error fetching budgets:', error);
            }
        };

        fetchBudgets();
    }, []);

    const addOrUpdateBudget = async (e) => {
        e.preventDefault();
        if (editingId) {
            // Update existing budget
            try {
                const response = await axios.put(`http://localhost:5000/api/budgets/${editingId}`, {
                    name,
                    amount,
                });
                setBudgets(budgets.map(budget => (budget._id === editingId ? response.data : budget))); // Update in state
                setEditingId(null); // Reset editing ID
            } catch (error) {
                console.error('Error updating budget:', error);
            }
        } else {
            // Add new budget
            try {
                const response = await axios.post('http://localhost:5000/api/budgets', {
                    name,
                    amount,
                });
                setBudgets([response.data, ...budgets]); // Add new budget to the top
            } catch (error) {
                console.error('Error adding budget:', error);
            }
        }
        setName('');
        setAmount('');
    };

    const handleEdit = (budget) => {
        setEditingId(budget._id); // Set the ID of the budget being edited
        setName(budget.name); // Set the input fields with the selected budget's name
        setAmount(budget.amount); // Set the input fields with the selected budget's amount
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/budgets/${id}`);
            setBudgets(budgets.filter(budget => budget._id !== id)); // Remove deleted budget from state
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    return (
        <div className="budget-container">
            <div className="budget-input-box">
                <form className="budget-inputs" onSubmit={addOrUpdateBudget}>
                    <input
                        type="text"
                        placeholder="Budget Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <button type="submit">{editingId ? 'Update Budget' : 'Add Budget'}</button>
                </form>
            </div>

            <h3 className="budget-heading">Budgets</h3>

            <ul className="budget-list">
                {budgets.map(budget => (
                    <li key={budget._id}>
                        {budget.name}: ${budget.amount}
                        <div className="budget-buttons">
                            <button className="edit-button" onClick={() => handleEdit(budget)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(budget._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
