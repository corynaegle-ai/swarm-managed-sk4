import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../contexts/GameContext';

const BidCollection = () => {
  const navigate = useNavigate();
  const { submitBids, gameState } = useContext(GameContext);
  const [collectedBids, setCollectedBids] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Validate that all required bids are entered
  const validateBids = () => {
    const requiredPlayers = gameState?.players || [];
    for (const player of requiredPlayers) {
      if (!collectedBids[player.id] || collectedBids[player.id].trim() === '') {
        return false;
      }
    }
    return requiredPlayers.length > 0;
  };

  const handleBidChange = (playerId, bidValue) => {
    setCollectedBids(prev => ({
      ...prev,
      [playerId]: bidValue
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate all bids are entered
    if (!validateBids()) {
      setError('Please enter bids for all players before submitting.');
      return;
    }

    setIsLoading(true);

    try {
      // Call submitBids with collected bid data
      await submitBids(collectedBids);
      
      // Navigate to next game phase after successful submission
      navigate('/game/results');
    } catch (err) {
      setError(err.message || 'Failed to submit bids. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const players = gameState?.players || [];

  return (
    <div className="bid-collection">
      <h2>Submit Your Bids</h2>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {players.map(player => (
          <div key={player.id} className="bid-input-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor={`bid-${player.id}`}>
              Bid for {player.name}:
            </label>
            <input
              id={`bid-${player.id}`}
              type="number"
              min="0"
              step="1"
              value={collectedBids[player.id] || ''}
              onChange={(e) => handleBidChange(player.id, e.target.value)}
              placeholder="Enter bid amount"
              disabled={isLoading}
              required
            />
          </div>
        ))}

        <button 
          type="submit" 
          disabled={isLoading || !validateBids()}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit Bids'}
        </button>
      </form>
    </div>
  );
};

export default BidCollection;