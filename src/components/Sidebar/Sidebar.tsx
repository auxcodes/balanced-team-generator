// Sidebar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <nav className={isOpen ? 'open' : ''}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/players">Create Teams</Link>
        </li>
        {/* Add other sidebar items with Link components */}
      </ul>
    </nav>
  );
};

export default Sidebar;
