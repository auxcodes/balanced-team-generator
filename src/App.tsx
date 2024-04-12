import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home';
import Players from './components/Pages/Players/Players';
import './App.css'; // Import your main CSS file
import { PATH } from './constants/path';
import CreateTeamsWorkflow from './components/Pages/CreateTeamsWorflow/CreateTeamsWorkflow';
import LoginPage from './components/Pages/LoginPage/LoginPage';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Assuming you have a state for login status

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
          <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={handleToggleSidebar} isLoggedIn={isLoggedIn}/>
          <div className="content">
            <Routes>
              <Route
                path={PATH.BASE_PATH} element={ <Home />}
              />
              <Route
                path={PATH.HOME_PATH} element={ <Home />}
              />
              <Route
                path={PATH.LOGIN_PATH} element={ <LoginPage onLogin={setIsLoggedIn} />}
              />
              <Route
                path={PATH.PLAYER_PATH}
                element={isLoggedIn ? <Players /> : <Navigate to={PATH.LOGIN_PATH} />}
              />
              <Route
                path={PATH.CREATE_TEAMS_PATH}
                element={isLoggedIn ? <CreateTeamsWorkflow /> : <Navigate to={PATH.LOGIN_PATH} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
