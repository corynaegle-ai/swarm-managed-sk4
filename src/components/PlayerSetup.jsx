import React, { useState } from 'react';
import './PlayerSetup.css';

const PlayerSetup = ({ onStartGame }) => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');

  const handleAddPlayer = () => {
    const trimmedName = playerName.trim();
    
    if (!trimmedName) {
      setError('Player name cannot be empty');
      return;
    }
    
    if (players.find(player => player.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('Player name already exists');
      return;
    }
    
    setPlayers([...players, { id: Date.now(), name: trimmedName }]);
    setPlayerName('');
    setError('');
  };

  const handleRemovePlayer = (id) => {
    setPlayers(players.filter(player => player.id !== id));
    setEditingIndex(-1);
  };

  const handleEditPlayer = (index, currentName) => {
    setEditingIndex(index);
    setEditName(currentName);
    setError('');
  };

  const handleSaveEdit = (index) => {
    const trimmedName = editName.trim();
    
    if (!trimmedName) {
      setError('Player name cannot be empty');
      return;
    }
    
    const isDuplicate = players.some((player, idx) => 
      idx !== index && player.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (isDuplicate) {
      setError('Player name already exists');
      return;
    }
    
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], name: trimmedName };
    setPlayers(updatedPlayers);
    setEditingIndex(-1);
    setEditName('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditName('');
    setError('');
  };

  const handleStartGame = () => {
    if (players.length >= 2 && onStartGame) {
      onStartGame(players);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const handleEditKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      handleSaveEdit(index);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="player-setup">
      <h2>Player Setup</h2>
      
      <div className="add-player-section">
        <div className="input-group">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter player name"
            className="player-input"
          />
          <button 
            onClick={handleAddPlayer}
            className="add-button"
          >
            Add Player
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="players-list">
        <h3>Players ({players.length})</h3>
        {players.length === 0 ? (
          <p className="no-players">No players added yet</p>
        ) : (
          <ul className="players">
            {players.map((player, index) => (
              <li key={player.id} className="player-item">
                {editingIndex === index ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyPress={(e) => handleEditKeyPress(e, index)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => handleSaveEdit(index)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <span className="player-name">{player.name}</span>
                    <div className="player-actions">
                      <button 
                        onClick={() => handleEditPlayer(index, player.name)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleRemovePlayer(player.id)}
                        className="remove-button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="start-game-section">
        <button 
          onClick={handleStartGame}
          disabled={players.length < 2}
          className={`start-game-button ${players.length < 2 ? 'disabled' : 'enabled'}`}
        >
          Start Game ({players.length >= 2 ? 'Ready' : `Need ${2 - players.length} more player${2 - players.length === 1 ? '' : 's'}`})
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;