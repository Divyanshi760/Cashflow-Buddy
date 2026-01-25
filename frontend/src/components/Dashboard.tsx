import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { 
    getBudgetOverview, 
    getCurrentWeekIndex, 
    getSpendingStatus 
} from '../apis';
import type { OverviewResponse } from '../apis';
import WarningScreen from './WarningScreen';

interface EnvelopeData {
    week: number;
    allocated: number;
    spent: number;
    remaining: number;
    status: 'safe' | 'warning' | 'danger';
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [envelopes, setEnvelopes] = useState<EnvelopeData[]>([]);
    const [currentWeek, setCurrentWeek] = useState(1);
    const [balanceLeft, setBalanceLeft] = useState(0);
    const [daysLeft, setDaysLeft] = useState(1);
    const [dailySafeSpend, setDailySafeSpend] = useState(0);
    const [suggestFreeze, setSuggestFreeze] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data: OverviewResponse = await getBudgetOverview();
            
            // Map API data to envelope format
            const weekData: EnvelopeData[] = data.budget.weeks.map((week) => ({
                week: week.week + 1, // API uses 0-indexed weeks
                allocated: week.allocated,
                spent: week.spent,
                remaining: week.balance,
                status: getSpendingStatus(week.spent, week.allocated),
            }));
            
            setEnvelopes(weekData);
            
            const weekIndex = getCurrentWeekIndex();
            setCurrentWeek(weekIndex + 1);
            setBalanceLeft(data.budget.weeks[weekIndex]?.balance || 0);
            setDaysLeft(data.burnRate.daysRemaining);
            setDailySafeSpend(Math.round(data.burnRate.safeDailySpend));
            setSuggestFreeze(data.suggestFreeze);
            
            // Show warning automatically when:
            // 1. Backend suggests a freeze (heavy spending detected - 2 expenses in same day)
            // 2. Low balance (below 30%)
            // 3. Any week has danger status (overspent)
            // 4. Current week spending > 50% of allocated
            const hasLowBalance = (data.burnRate.remainingMoney / data.budget.allowance) < 0.3;
            const hasDangerWeek = weekData.some(w => w.status === 'danger');
            const currentWeekData = data.budget.weeks[weekIndex];
            const heavySpending = currentWeekData && currentWeekData.spent > (currentWeekData.allocated * 0.5);
            
            if (data.suggestFreeze || hasLowBalance || hasDangerWeek || heavySpending) {
                setShowWarning(true);
            }
            
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <div className="dashboard">
                <div className="dashboard__container">
                    <div className="dashboard__nudge">
                        <span className="dashboard__nudge-text">Loading your budget...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="dashboard__container">
                    <div className="dashboard__nudge">
                        <span className="dashboard__nudge-emoji">⚠️</span>
                        <span className="dashboard__nudge-text">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

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

                {/* Freeze Suggestion - Click to show warning */}
                {suggestFreeze && (
                    <div 
                        className="dashboard__nudge" 
                        style={{ backgroundColor: '#fee2e2', borderColor: '#f87171', cursor: 'pointer' }}
                        onClick={() => setShowWarning(true)}
                    >
                        <span className="dashboard__nudge-emoji">🥶</span>
                        <span className="dashboard__nudge-text">
                            Heavy spending detected! Tap to see details.
                        </span>
                    </div>
                )}

                {/* Micro Nudge - Click to view warning details */}
                <div 
                    className="dashboard__nudge"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowWarning(true)}
                >
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
            
            {/* Warning Screen Modal */}
            <WarningScreen 
                isOpen={showWarning} 
                onClose={() => setShowWarning(false)} 
            />
        </div>
    );
};

export default Dashboard;
