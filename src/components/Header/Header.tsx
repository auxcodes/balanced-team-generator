import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface HeaderProps {
  isSidebarOpen: boolean;
  isLoggedIn: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, onToggleSidebar, isLoggedIn }) => {
  return (
    <header>
      <h1 className="title">Balanced Team Generator</h1>
    </header>
  );
};

export default Header;
