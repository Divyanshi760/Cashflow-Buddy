import React from 'react';
import './NeoButton.css';

interface NeoButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}) => {
  return (
    <button
      className={`neo-button neo-button--${variant} neo-button--${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default NeoButton;
