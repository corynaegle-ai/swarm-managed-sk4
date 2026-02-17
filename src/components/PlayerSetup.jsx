import React, { useState } from 'react';
import './PlayerSetup.css';

const PlayerSetup = () => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  
  const MAX_PLAYERS = 8;

  const handleAddPlayer = () => {
    if (playerName.trim() && players.length < MAX_PLAYERS) {
      setPlayers([...players, playerName.trim()]);
      setPlayerName('');
    }
  };

  const handleDeletePlayer = (index) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
  };

  const renderPlayerList = () => {
    if (players.length === 0) {
      return (
        <div className="empty-state">
          <p>No players added yet. Add your first player above!</p>
        </div>
      );
    }

    return (
      <ul className="player-list">
        {players.map((player, index) => (
          <li key={index} className="player-item">
            <span className="player-name">{player}</span>
            <button
              className="delete-button"
              onClick={() => handleDeletePlayer(index)}
              aria-label={`Remove ${player}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="player-setup">
      <h2>Player Setup</h2>
      
      <div className="add-player-section">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
          maxLength={50}
          onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
        />
        <button
          onClick={handleAddPlayer}
          disabled={!playerName.trim() || players.length >= MAX_PLAYERS}
        >
          Add Player
        </button>
      </div>

      <div className="player-count">
        {players.length}/{MAX_PLAYERS} players
      </div>

      <div className="player-list-container">
        {renderPlayerList()}
      </div>
    </div>
  );
};

export default PlayerSetup;