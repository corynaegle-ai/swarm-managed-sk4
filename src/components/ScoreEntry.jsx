import React, { useState, useEffect } from 'react';
import './ScoreEntry.css';

const ScoreEntry = ({ players, handCount, onScoreChange }) => {
  const [scores, setScores] = useState(() => {
    const initialScores = {};
    players.forEach(player => {
      initialScores[player.id] = {
        tricksTaken: '',
        bonusPoints: 0,
        totalScore: 0
      };
    });
    return initialScores;
  });

  const calculateScore = (player, tricksTaken, bonusPoints) => {
    const tricks = parseInt(tricksTaken) || 0;
    const bonus = parseInt(bonusPoints) || 0;
    const bid = player.bid || 0;
    
    let baseScore = 0;
    if (tricks === bid) {
      // Made bid exactly
      baseScore = 10 + bid;
    } else {
      // Missed bid
      baseScore = tricks;
    }
    
    return baseScore + bonus;
  };

  const handleTricksChange = (playerId, value) => {
    const numValue = parseInt(value);
    
    // Validate range (0 to handCount)
    if (value === '' || (numValue >= 0 && numValue <= handCount)) {
      const player = players.find(p => p.id === playerId);
      const newScores = {
        ...scores,
        [playerId]: {
          ...scores[playerId],
          tricksTaken: value,
          totalScore: calculateScore(player, value, scores[playerId].bonusPoints)
        }
      };
      setScores(newScores);
      
      if (onScoreChange) {
        onScoreChange(playerId, newScores[playerId]);
      }
    }
  };

  const handleBonusChange = (playerId, value) => {
    const player = players.find(p => p.id === playerId);
    const newScores = {
      ...scores,
      [playerId]: {
        ...scores[playerId],
        bonusPoints: parseInt(value) || 0,
        totalScore: calculateScore(player, scores[playerId].tricksTaken, value)
      }
    };
    setScores(newScores);
    
    if (onScoreChange) {
      onScoreChange(playerId, newScores[playerId]);
    }
  };

  return (
    <div className="score-entry">
      <h3>Round Scoring</h3>
      <div className="score-entry-grid">
        {players.map(player => (
          <div key={player.id} className="player-score-row">
            <div className="player-info">
              <span className="player-name">{player.name}</span>
              <span className="player-bid">Bid: {player.bid || 0}</span>
            </div>
            
            <div className="score-inputs">
              <div className="input-group">
                <label htmlFor={`tricks-${player.id}`}>Tricks Taken:</label>
                <input
                  id={`tricks-${player.id}`}
                  type="number"
                  min="0"
                  max={handCount}
                  value={scores[player.id].tricksTaken}
                  onChange={(e) => handleTricksChange(player.id, e.target.value)}
                  className="tricks-input"
                  placeholder="0"
                />
                <span className="input-range">0-{handCount}</span>
              </div>
              
              <div className="input-group">
                <label htmlFor={`bonus-${player.id}`}>Bonus Points:</label>
                <input
                  id={`bonus-${player.id}`}
                  type="number"
                  value={scores[player.id].bonusPoints}
                  onChange={(e) => handleBonusChange(player.id, e.target.value)}
                  className="bonus-input"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="score-display">
              <span className="round-score">
                Round Score: {scores[player.id].totalScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreEntry;