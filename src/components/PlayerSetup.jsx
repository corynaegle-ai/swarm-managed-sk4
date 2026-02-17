import React, { useState } from 'react';
import './PlayerSetup.css';

const PlayerSetup = () => {
  const [players, setPlayers] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [error, setError] = useState('');

  const handleAddPlayer = (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    // Validate empty name
    if (!currentInput.trim()) {
      setError('Player name cannot be empty');
      return;
    }
    
    // Validate duplicate name
    if (players.some(player => player.toLowerCase() === currentInput.trim().toLowerCase())) {
      setError('Player name already exists');
      return;
    }
    
    // Add player and clear input
    setPlayers([...players, currentInput.trim()]);
    setCurrentInput('');
  };

  const handleInputChange = (e) => {
    setCurrentInput(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const removePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  return (
    <div className="player-setup">
      <h2>Player Setup</h2>
      
      <form onSubmit={handleAddPlayer} className="add-player-form">
        <div className="input-group">
          <input
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            placeholder="Enter player name"
            className={`player-input ${error ? 'error' : ''}`}
          />
          <button type="submit" className="add-button">
            Add Player
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>

      <div className="players-list">
        <h3>Players ({players.length})</h3>
        {players.length === 0 ? (
          <p className="no-players">No players added yet</p>
        ) : (
          <ul>
            {players.map((player, index) => (
              <li key={index} className="player-item">
                <span>{player}</span>
                <button
                  onClick={() => removePlayer(index)}
                  className="remove-button"
                  aria-label={`Remove ${player}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlayerSetup;