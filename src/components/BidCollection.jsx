import React, { useState } from 'react';
import './BidCollection.css';

const BidCollection = ({ players = [] }) => {
  // Initialize state with useState for bids object
  const [bids, setBids] = useState({});

  // Create handleBidChange function to update individual player bids
  const handleBidChange = (playerName, value) => {
    setBids(prevBids => ({
      ...prevBids,
      [playerName]: value
    }));
  };

  return (
    <div className="bid-collection">
      <h2>Player Bids</h2>
      <div className="player-inputs">
        {/* Add JSX section that maps over players array */}
        {players.map((player) => {
          const playerName = typeof player === 'string' ? player : player.name;
          return (
            <div key={playerName} className="player-input-group">
              {/* For each player, render label with player name and input field */}
              <label htmlFor={`bid-${playerName}`} className="player-label">
                {playerName}
              </label>
              <input
                id={`bid-${playerName}`}
                type="number"
                min="0"
                className="bid-input"
                value={bids[playerName] || ''}
                onChange={(e) => handleBidChange(playerName, e.target.value)}
                placeholder="Enter bid"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BidCollection;