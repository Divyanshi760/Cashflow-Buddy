import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WarningScreen.css';

interface WarningScreenProps {
    dailyRemaining?: number;
    daysLeft?: number;
    budgetRemaining?: number;
    totalBudget?: number;
    triggerType?: 'overspending' | 'low-balance' | 'heavy-days';
}

const WarningScreen: React.FC<WarningScreenProps> = ({
    dailyRemaining = 90,
    daysLeft = 15,
    budgetRemaining = 1350,
    totalBudget = 3000,
    triggerType = 'low-balance'
}) => {
    const navigate = useNavigate();
    const [progressWidth, setProgressWidth] = useState(100);

    useEffect(() => {
        // Calculate progress percentage
        const percentage = (budgetRemaining / totalBudget) * 100;
        setProgressWidth(percentage);
    }, [budgetRemaining, totalBudget]);

    const handleFreeze = () => {
        // In a real app, this would trigger a freeze action
        console.log('Spending frozen for 24 hours');
        alert('Spending frozen for 24 hours! 🔒');
        navigate('/dashboard');
    };

    const handleIgnore = () => {
        // Navigate back without shame
        navigate('/dashboard');
    };

    const getWarningMessage = () => {
        switch (triggerType) {
            case 'overspending':
                return 'Your spending rate is above budget. Slow down to avoid running out!';
            case 'heavy-days':
                return 'Two heavy spending days detected. Take a breather to stay on track.';
            case 'low-balance':
            default:
                return 'To last till month-end.';
        }
    };

    return (
        <div className="warning-screen">
            <div className="warning-container">
                <span className="warning-icon">⚠️</span>

                {/* Headline */}
                <h1 className="warning-headline">
                    ₹{dailyRemaining}/day
                </h1>
                <p className="warning-subtext">Remaining</p>

                {/* Explanation */}
                <div className="warning-explanation">
                    <p className="warning-explanation-text">
                        {getWarningMessage()}
                    </p>
                </div>

                {/* Visual Indicators */}
                <div className="warning-visual">
                    {/* Countdown */}
                    <div className="countdown-section">
                        <div className="countdown-label">Days Until Month-End</div>
                        <div className="countdown-value">{daysLeft}</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill animated"
                            style={{
                                '--progress-width': `${progressWidth}%`,
                                width: `${progressWidth}%`
                            } as React.CSSProperties}
                        >
                            {progressWidth > 20 && `${Math.round(progressWidth)}%`}
                        </div>
                    </div>
                </div>

                {/* Soft Controls */}
                <div className="warning-controls">
                    <button
                        className="warning-btn warning-btn-primary"
                        onClick={handleFreeze}
                    >
                        🔒 Freeze Spending for 24h
                    </button>
                    <button
                        className="warning-btn warning-btn-secondary"
                        onClick={handleIgnore}
                    >
                        I'll Be Careful
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WarningScreen;
