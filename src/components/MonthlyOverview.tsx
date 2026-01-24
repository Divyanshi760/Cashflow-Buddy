import React, { useMemo } from 'react';
import './MonthlyOverview.css';

interface Transaction {
    id: string;
    amount: number;
    category: string;
    categoryIcon: string;
    date: string;
    note?: string;
}

const MonthlyOverview: React.FC = () => {
    // Mock Data
    const allowance = 3000;
    const weeklyBudget = 750;

    const weeklySpends = [
        { week: 1, spent: 850 }, // Overspent
        { week: 2, spent: 600 }, // Safe
        { week: 3, spent: 450 }, // Safe (tight because of w1)
        { week: 4, spent: 680 }, // Safe
    ];

    // Sample transaction data - in real app, this would come from state/props
    const transactions: Transaction[] = [
        { id: '1', amount: 250, category: 'Food', categoryIcon: '🍔', date: 'Today', note: 'Lunch' },
        { id: '2', amount: 500, category: 'Travel', categoryIcon: '🚕', date: 'Today' },
        { id: '3', amount: 120, category: 'Snacks', categoryIcon: '🍿', date: 'Yesterday' },
        { id: '4', amount: 80, category: 'Transport', categoryIcon: '🚌', date: 'Yesterday', note: 'Bus fare' },
        { id: '5', amount: 350, category: 'Fun', categoryIcon: '🎮', date: 'Jan 22' },
        { id: '6', amount: 200, category: 'Food', categoryIcon: '🍔', date: 'Jan 21', note: 'Dinner' },
    ];

    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const date = transaction.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {} as Record<string, Transaction[]>);

    // Calculations
    const totalSpent = weeklySpends.reduce((acc, curr) => acc + curr.spent, 0);
    const saved = allowance - totalSpent;

    const getStatusColor = (spent: number) => {
        if (spent > weeklyBudget) return '#FF006E'; // Vibrant Pink/Red
        if (spent > weeklyBudget * 0.9) return '#FFD60A'; // Vibrant Yellow
        return '#00D9FF'; // Vibrant Cyan
    };

    // Insight Logic
    const insightMessage = useMemo(() => {
        const w1 = weeklySpends[0].spent;
        const w3 = weeklySpends[2].spent;
        const w2 = weeklySpends[1].spent;
        const w4 = weeklySpends[3].spent;

        if (w1 > weeklyBudget && w3 < weeklyBudget) {
            return "Week 1 overspending caused tight Week 3.";
        } else if (w2 < weeklyBudget && w4 < weeklyBudget) {
            return "Great job! Consistent saving in Week 2 & 4.";
        } else if (weeklySpends.every(w => w.spent <= weeklyBudget)) {
            return "Steady spending! You stayed within budget all month.";
        }
        return "Keep tracking to see your monthly patterns!";
    }, [weeklySpends, weeklyBudget]);

    return (
        <div className="monthly-overview">
            <div className="monthly-container">
                <header>
                    <h1 className="monthly-header">Monthly Overview</h1>
                </header>

                {/* Summary Stats */}
                <section className="monthly-summary">
                    <div className="summary-card">
                        <span className="summary-label">Allowance</span>
                        <span className="summary-value">₹{allowance}</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">Spent</span>
                        <span className="summary-value">₹{totalSpent}</span>
                    </div>
                    <div className="summary-card" style={{ backgroundColor: saved >= 0 ? '#00D9FF' : '#FF006E' }}>
                        <span className="summary-label">Saved</span>
                        <span className="summary-value">₹{saved}</span>
                    </div>
                </section>

                {/* Weekly Breakdown Chart */}
                <section className="monthly-chart-section">
                    <h2 className="section-title">Weekly Breakdown</h2>
                    <div className="chart-container">
                        {weeklySpends.map((week) => (
                            <div key={week.week} className="chart-bar-group">
                                <div
                                    className="chart-bar"
                                    style={{
                                        height: `${Math.min((week.spent / 1000) * 100, 100)}%`, // specific scaling for demo
                                        backgroundColor: getStatusColor(week.spent)
                                    }}
                                >
                                    <span className="chart-bar-value">₹{week.spent}</span>
                                </div>
                                <span className="chart-label">W{week.week}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Insight Section */}
                <section className="monthly-insight">
                    <div className="insight-header">
                        <span className="insight-icon">💡</span>
                        <span>Insight</span>
                    </div>
                    <p className="insight-text">
                        "{insightMessage}"
                    </p>
                </section>

                {/* Transaction History Section */}
                <section className="monthly-transactions">
                    <h2 className="section-title">Transaction History</h2>
                    <p className="transactions-subtitle">Your money story lives here</p>

                    <div className="transactions-list">
                        {Object.entries(groupedTransactions).map(([date, txns]) => (
                            <div key={date} className="transactions-group">
                                <div className="transactions-date">{date}</div>
                                {txns.map((transaction) => (
                                    <div key={transaction.id} className="transaction-item neo-list-item">
                                        <div className="transaction-left">
                                            <span className="neo-list-item__icon">
                                                {transaction.categoryIcon}
                                            </span>
                                            <div className="transaction-details">
                                                <span className="transaction-category">
                                                    {transaction.category}
                                                </span>
                                                {transaction.note && (
                                                    <span className="transaction-note">
                                                        {transaction.note}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="transaction-amount">
                                            ₹{transaction.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MonthlyOverview;
