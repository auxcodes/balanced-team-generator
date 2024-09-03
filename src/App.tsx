import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import './App.css'; // Import your main CSS file
import { PATH } from './constants/path';
import CreateTeamsWorkflow from './components/Pages/CreateTeamsWorflow/CreateTeamsWorkflow';
import { PlayerModel } from './components/Pages/CreateTeamsWorflow/Models/CreateTeamsModels';
import { PlayerList } from './mocks/PlayerMock';
import Players from './components/Pages/Players/Players';


interface AppUserContext {
  userPlayers: PlayerModel[],
  setUserPlayers: React.Dispatch<React.SetStateAction<PlayerModel[]>>
}
export const UserContext = createContext<AppUserContext>({
  userPlayers: [],
  setUserPlayers: () => { }
});


const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Assuming you have a state for login status
  const [userPlayers, setUserPlayers] = useState<PlayerModel[]>([]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  React.useEffect(() => {
    setUserPlayers(PlayerList);
  }, []);

  return (
    <UserContext.Provider value={{ userPlayers, setUserPlayers }}>
      <Router>
        <div className="App">
          <div className={`right ${isSidebarOpen ? '' : 'hide'}`}>
            <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={handleToggleSidebar} isLoggedIn={isLoggedIn} />
            <div className="content">
              <Routes>
                <Route
                  path={PATH.BASE_PATH} element={<CreateTeamsWorkflow />}
                />
                <Route
                  path={PATH.HOME_PATH} element={<CreateTeamsWorkflow />}
                />
                <Route
                  path={PATH.CREATE_TEAMS_PATH} element={<CreateTeamsWorkflow />}
                />
                <Route
                  path={PATH.PLAYERS} element={<Players />}
                />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
