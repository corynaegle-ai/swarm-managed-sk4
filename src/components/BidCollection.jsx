import React, { useState } from 'react';
import './BidCollection.css';

const BidCollection = ({ players, handCount, onBidsSubmitted }) => {
  const [bids, setBids] = useState({});
  const [errors, setErrors] = useState({});

  const validateBid = (playerId, bid) => {
    const bidValue = parseInt(bid, 10);
    if (isNaN(bidValue) || bidValue < 0 || bidValue > handCount) {
      return `Bid must be between 0 and ${handCount}`;
    }
    return null;
  };

  const handleBidChange = (playerId, bid) => {
    setBids(prev => ({ ...prev, [playerId]: bid }));
    
    const error = validateBid(playerId, bid);
    setErrors(prev => ({ 
      ...prev, 
      [playerId]: error 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all bids before submission
    const newErrors = {};
    let hasErrors = false;
    
    players.forEach(player => {
      const bid = bids[player.id] || '';
      const error = validateBid(player.id, bid);
      if (error) {
        newErrors[player.id] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    
    if (!hasErrors && onBidsSubmitted) {
      const validBids = {};
      players.forEach(player => {
        validBids[player.id] = parseInt(bids[player.id] || '0', 10);
      });
      onBidsSubmitted(validBids);
    }
  };

  return (
    <div className="bid-collection">
      <h2>Enter Bids for Hand {handCount}</h2>
      <form onSubmit={handleSubmit}>
        {players.map(player => (
          <div key={player.id} className="bid-input-group">
            <label htmlFor={`bid-${player.id}`}>
              {player.name}:
            </label>
            <input
              id={`bid-${player.id}`}
              type="number"
              min="0"
              max={handCount}
              value={bids[player.id] || ''}
              onChange={(e) => handleBidChange(player.id, e.target.value)}
              className={errors[player.id] ? 'error' : ''}
              placeholder="Enter bid"
            />
            {errors[player.id] && (
              <div className="error-message">
                {errors[player.id]}
              </div>
            )}
          </div>
        ))}
        <button type="submit" className="submit-bids">
          Submit Bids
        </button>
      </form>
    </div>
  );
};

export default BidCollection;