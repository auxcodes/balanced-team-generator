// Sidebar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { PATH } from '../../constants/path';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {

  const playerPath = PATH.BASE_PATH + "/player";
  return (
    <nav className={isOpen ? 'open' : ''}>
      <ul>
        <li>
          <Link to={PATH.BASE_PATH}>Home</Link>
        </li>
        <li>
          <Link to={playerPath}>Create Teams</Link>
        </li>
        {/* Add other sidebar items with Link components */}
      </ul>
    </nav>
  );
};

export default Sidebar;
