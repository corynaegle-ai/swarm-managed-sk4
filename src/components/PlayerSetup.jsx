import React, { useState } from 'react';
import './PlayerSetup.css';

const PlayerSetup = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="player-setup-container">
      <div className="player-setup-form">
        <h2>Player Setup</h2>
        
        {/* Form area for adding players */}
        <div className="form-area">
          <input 
            type="text" 
            placeholder="Enter player name"
            className="player-input"
          />
          <button className="add-player-btn">
            Add Player
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {/* Player list area */}
      <div className="player-list-container">
        <h3>Players ({players.length})</h3>
        <div className="player-list">
          {players.length === 0 ? (
            <p className="empty-list">No players added yet</p>
          ) : (
            players.map((player, index) => (
              <div key={index} className="player-item">
                {player}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Start game button */}
      <div className="game-controls">
        <button 
          className="start-game-btn"
          disabled={loading || players.length === 0}
        >
          {loading ? 'Starting...' : 'Start Game'}
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;