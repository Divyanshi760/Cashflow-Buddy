import React, { useState } from 'react';
import './NeoNav.css';

interface NavItem {
    label: string;
    href: string;
}

interface NeoNavProps {
    logo?: string;
    items: NavItem[];
    onItemClick?: (item: NavItem) => void;
}

const NeoNav: React.FC<NeoNavProps> = ({ logo = 'LOGO', items, onItemClick }) => {
    const [activeItem, setActiveItem] = useState<string | null>(null);

    const handleItemClick = (item: NavItem, e: React.MouseEvent) => {
        e.preventDefault();
        setActiveItem(item.label);
        if (onItemClick) {
            onItemClick(item);
        }
    };

    return (
        <nav className="neo-nav">
            <div className="neo-nav__container">
                <div className="neo-nav__logo">{logo}</div>
                <ul className="neo-nav__menu">
                    {items.map((item) => (
                        <li key={item.label} className="neo-nav__item">
                            <a
                                href={item.href}
                                className={`neo-nav__link ${activeItem === item.label ? 'neo-nav__link--active' : ''
                                    }`}
                                onClick={(e) => handleItemClick(item, e)}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default NeoNav;
