import React from 'react';
import './NeoBackground.css';

interface NeoBackgroundProps {
    children: React.ReactNode;
}

const NeoBackground: React.FC<NeoBackgroundProps> = ({ children }) => {
    return <div className="neo-background">{children}</div>;
};

export default NeoBackground;
