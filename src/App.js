import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import PlayerSetup from './components/PlayerSetup';
import Game from './components/Game';
import './App.css';

function App() {
  const [playerData, setPlayerData] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const handlePlayersSetup = (players) => {
    setPlayerData(players);
  };

  const handleGameStart = () => {
    setGameStarted(true);
  };

  const handleBackToSetup = () => {
    setGameStarted(false);
  };

  const handleBackToMenu = () => {
    setPlayerData([]);
    setGameStarted(false);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route 
            path="/setup" 
            element={
              <PlayerSetup 
                onPlayersSetup={handlePlayersSetup}
                onBackToMenu={handleBackToMenu}
                initialPlayers={playerData}
              />
            } 
          />
          <Route 
            path="/game" 
            element={
              playerData.length > 0 ? (
                <Game 
                  players={playerData}
                  onBackToSetup={handleBackToSetup}
                  onBackToMenu={handleBackToMenu}
                />
              ) : (
                <Navigate to="/setup" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;