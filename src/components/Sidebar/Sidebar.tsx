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
  const createTeamsPath = PATH.BASE_PATH + "/createTeams";
  return (
    <nav className={isOpen ? 'open' : ''}>
      <ul>
        <li>
          <Link to={PATH.BASE_PATH}>Login</Link>
        </li>
        <li>
          <Link to={PATH.HOME_PATH}>Home</Link>
        </li>
        <li>
          <Link to={PATH.PLAYER_PATH}>Create Teams</Link>
        </li>
        <li>
          <Link to={PATH.CREATE_TEAMS_PATH}>Create Teams Workflow</Link>
        </li>
        {/* Add other sidebar items with Link components */}
      </ul>
    </nav>
  );
};

export default Sidebar;
