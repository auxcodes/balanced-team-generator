// App.tsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home';
import Players from './components/Pages/Players/Players';
import './App.css'; // Import your main CSS file
import { PATH } from './constants/path';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const playerPath = PATH.BASE_PATH + "/player";

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="App">
        <div className={`${isSidebarOpen ? 'leftDisplay' : 'leftHide'}`}>
          <Sidebar isOpen={isSidebarOpen} />
        </div>

        <div className={`right ${isSidebarOpen ? '' : 'hide'}`}>
          <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={handleToggleSidebar} />
          <div className="content">
            <Routes>
              <Route path={PATH.BASE_PATH} element={<Home />} />
              <Route path={playerPath} element={<Players />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
