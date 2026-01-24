import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage.css';
import NeoButton from './NeoButton';

const OnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const [allowance, setAllowance] = useState('');
    const [customizeWeeks, setCustomizeWeeks] = useState(false);

    const handleStartBudgeting = () => {
        if (allowance) {
            console.log('Starting budget with allowance:', allowance);
            console.log('Customize weeks:', customizeWeeks);
            // Navigate based on customize weeks preference
            if (customizeWeeks) {
                navigate('/weekly-split', { state: { allowance } });
            } else {
                navigate('/dashboard');
            }
        } else {
            alert('Please enter your monthly allowance');
        }
    };

    return (
        <div className="onboarding">
            <div className="onboarding__container">
                {/* App Branding */}
                <div className="onboarding__header">
                    <h1 className="onboarding__title">Cashflow Buddy</h1>
                    <p className="onboarding__tagline">
                        Make your month last till your next allowance.
                    </p>
                </div>

                {/* Envelope Illustration */}
                <div className="onboarding__illustration">
                    <img
                        src="/envelope_illustration.png"
                        alt="Money split into 4 weekly envelopes"
                        className="onboarding__image"
                    />
                </div>

                {/* Input Card */}
                <div className="onboarding__card">
                    <label htmlFor="allowance" className="onboarding__label">
                        Monthly Allowance
                    </label>
                    <div className="onboarding__input-wrapper">
                        <span className="onboarding__currency">₹</span>
                        <input
                            id="allowance"
                            type="number"
                            className="onboarding__input"
                            placeholder="3000"
                            value={allowance}
                            onChange={(e) => setAllowance(e.target.value)}
                        />
                    </div>

                    {/* Toggle */}
                    <div className="onboarding__toggle">
                        <label className="onboarding__checkbox-label">
                            <input
                                type="checkbox"
                                checked={customizeWeeks}
                                onChange={(e) => setCustomizeWeeks(e.target.checked)}
                                className="onboarding__checkbox"
                            />
                            <span className="onboarding__checkbox-text">
                                Customize weekly splits
                            </span>
                        </label>
                    </div>

                    {/* CTA Button */}
                    <div className="onboarding__button-wrapper">
                        <NeoButton
                            variant="primary"
                            size="large"
                            onClick={handleStartBudgeting}
                        >
                            Start Budgeting
                        </NeoButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
