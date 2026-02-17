import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BidCollection from './components/BidCollection';
import { GameProvider } from './contexts/GameContext';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/bid-collection" replace />} />
            <Route path="/bid-collection" element={<BidCollection />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;