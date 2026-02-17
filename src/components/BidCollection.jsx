import React, { useState } from 'react';
import './BidCollection.css';

const BidCollection = ({ players = [], onSubmit }) => {
  const [bids, setBids] = useState({});

  const handleBidChange = (playerId, value) => {
    setBids(prev => ({
      ...prev,
      [playerId]: value
    }));
  };

  const isFormValid = () => {
    // Check if all players have valid bids entered
    if (!players || players.length === 0) return false;
    
    for (const player of players) {
      const bid = bids[player.id];
      if (!bid || isNaN(bid) || parseFloat(bid) <= 0) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (isFormValid() && onSubmit) {
      // Convert bid values to numbers
      const processedBids = {};
      Object.keys(bids).forEach(playerId => {
        processedBids[playerId] = parseFloat(bids[playerId]);
      });
      onSubmit(processedBids);
    }
  };

  return (
    <div className="bid-collection">
      <h2>Enter Bids</h2>
      <div className="bid-inputs">
        {players.map(player => (
          <div key={player.id} className="bid-input-group">
            <label htmlFor={`bid-${player.id}`}>
              {player.name}:
            </label>
            <input
              id={`bid-${player.id}`}
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter bid amount"
              value={bids[player.id] || ''}
              onChange={(e) => handleBidChange(player.id, e.target.value)}
              className="bid-input"
            />
          </div>
        ))}
      </div>
      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={!isFormValid()}
      >
        Submit Bids
      </button>
    </div>
  );
};

export default BidCollection;