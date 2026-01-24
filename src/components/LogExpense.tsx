import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogExpense.css';
import NeoButton from './NeoButton';

interface Category {
    id: string;
    icon: string;
    label: string;
}

const LogExpense: React.FC = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [note, setNote] = useState('');

    const categories: Category[] = [
        { id: 'food', icon: '🍔', label: 'Food' },
        { id: 'transport', icon: '🚕', label: 'Transport' },
        { id: 'fun', icon: '🎮', label: 'Fun' },
        { id: 'other', icon: '📦', label: 'Other' },
    ];

    // Sample calculation - in real app, this would use actual week balance
    const weekBalance = 420;
    const amountNum = parseFloat(amount) || 0;
    const remainingBalance = weekBalance - amountNum;

    const handleAddExpense = () => {
        if (!amount || !selectedCategory) {
            alert('Please enter amount and select a category');
            return;
        }
        console.log('Adding expense:', { amount, category: selectedCategory, note });
        // In real app, this would save the expense
        navigate('/dashboard');
    };

    return (
        <div className="log-expense">
            <div className="log-expense__container">
                <h1 className="log-expense__title">Log Expense</h1>

                {/* Amount Input */}
                <div className="log-expense__section">
                    <label htmlFor="amount" className="log-expense__label">
                        Amount
                    </label>
                    <div className="log-expense__input-wrapper">
                        <span className="log-expense__currency">₹</span>
                        <input
                            id="amount"
                            type="number"
                            className="log-expense__input"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Selection */}
                <div className="log-expense__section">
                    <label className="log-expense__label">Category</label>
                    <div className="log-expense__categories">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={`log-expense__category ${selectedCategory === category.id ? 'log-expense__category--active' : ''
                                    }`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <span className="log-expense__category-icon">{category.icon}</span>
                                <span className="log-expense__category-label">{category.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Optional Note */}
                <div className="log-expense__section">
                    <label htmlFor="note" className="log-expense__label">
                        Note (Optional)
                    </label>
                    <input
                        id="note"
                        type="text"
                        className="log-expense__note"
                        placeholder="e.g., Lunch with friends"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                {/* Smart Feedback */}
                {amount && (
                    <div className="log-expense__feedback">
                        This leaves ₹{remainingBalance} for the week.
                    </div>
                )}

                {/* CTA Button */}
                <div className="log-expense__button-wrapper">
                    <NeoButton variant="primary" size="large" onClick={handleAddExpense}>
                        Add Expense
                    </NeoButton>
                </div>
            </div>
        </div>
    );
};

export default LogExpense;
