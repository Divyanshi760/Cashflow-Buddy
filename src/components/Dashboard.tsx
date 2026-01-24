import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface EnvelopeData {
    week: number;
    allocated: number;
    spent: number;
    remaining: number;
    status: 'safe' | 'warning' | 'danger';
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    // Sample data - in real app, this would come from state/props
    const currentWeek = 2;
    const balanceLeft = 420;
    const daysLeft = 3;
    const dailySafeSpend = Math.round(balanceLeft / daysLeft);

    const envelopes: EnvelopeData[] = [
        { week: 1, allocated: 750, spent: 750, remaining: 0, status: 'safe' },
        { week: 2, allocated: 750, spent: 330, remaining: 420, status: 'warning' },
        { week: 3, allocated: 750, spent: 0, remaining: 750, status: 'safe' },
        { week: 4, allocated: 750, spent: 0, remaining: 750, status: 'safe' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'safe':
                return '#4ade80'; // Green
            case 'warning':
                return '#fbbf24'; // Yellow
            case 'danger':
                return '#f87171'; // Red
            default:
                return '#88aaee';
        }
    };

    const handleLogExpense = () => {
        navigate('/log-expense');
    };

    return (
        <div className="dashboard">
            <div className="dashboard__container">
                {/* Top Section */}
                <div className="dashboard__top">
                    <div className="dashboard__stat-card">
                        <div className="dashboard__stat-label">Current Week</div>
                        <div className="dashboard__stat-value">Week {currentWeek}</div>
                    </div>
                    <div className="dashboard__stat-card dashboard__stat-card--highlight">
                        <div className="dashboard__stat-label">Balance Left</div>
                        <div className="dashboard__stat-value">₹{balanceLeft}</div>
                    </div>
                    <div className="dashboard__stat-card">
                        <div className="dashboard__stat-label">Days Left</div>
                        <div className="dashboard__stat-value">{daysLeft}</div>
                    </div>
                </div>

                {/* Micro Nudge */}
                <div className="dashboard__nudge">
                    <span className="dashboard__nudge-emoji">👍</span>
                    <span className="dashboard__nudge-text">
                        You're doing okay. ₹{dailySafeSpend}/day left
                    </span>
                </div>

                {/* Envelope Cards */}
                <div className="dashboard__envelopes">
                    <h2 className="dashboard__section-title">Weekly Envelopes</h2>
                    <div className="dashboard__envelope-grid">
                        {envelopes.map((envelope) => (
                            <div
                                key={envelope.week}
                                className="dashboard__envelope"
                                style={{ borderColor: getStatusColor(envelope.status) }}
                            >
                                <div className="dashboard__envelope-header">
                                    <span className="dashboard__envelope-week">Week {envelope.week}</span>
                                    <span
                                        className="dashboard__envelope-status"
                                        style={{ backgroundColor: getStatusColor(envelope.status) }}
                                    />
                                </div>
                                <div className="dashboard__envelope-amount">₹{envelope.remaining}</div>
                                <div className="dashboard__envelope-label">Remaining</div>
                                <div className="dashboard__envelope-progress">
                                    <div
                                        className="dashboard__envelope-progress-bar"
                                        style={{
                                            width: `${(envelope.remaining / envelope.allocated) * 100}%`,
                                            backgroundColor: getStatusColor(envelope.status),
                                        }}
                                    />
                                </div>
                                <div className="dashboard__envelope-details">
                                    <span>Spent: ₹{envelope.spent}</span>
                                    <span>of ₹{envelope.allocated}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating Button */}
                <button className="dashboard__fab" onClick={handleLogExpense}>
                    <span className="dashboard__fab-icon">➕</span>
                    <span className="dashboard__fab-text">Log Expense</span>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
