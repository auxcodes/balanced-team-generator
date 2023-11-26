// Header.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  return (
    <header>
      <button className="menu-icon" onClick={onToggleSidebar}>
        <FontAwesomeIcon icon={isSidebarOpen ? faArrowLeft : faArrowRight} />
      </button>
      <h1 className="title">Balanced Team Generator</h1>
    </header>
  );
};

export default Header;
