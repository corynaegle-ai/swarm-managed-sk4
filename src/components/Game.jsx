import React, { useState, useCallback } from 'react';
import ScoreEntry from './ScoreEntry';

const Game = () => {
  const [gamePhase, setGamePhase] = useState('bidding'); // Can be 'bidding', 'playing', 'scoreEntry', 'gameOver'
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
    { id: 3, name: 'Player 3', score: 0 },
    { id: 4, name: 'Player 4', score: 0 }
  ]);
  const [currentRoundBids, setCurrentRoundBids] = useState({});
  const [currentHandCount, setCurrentHandCount] = useState(10);

  const handleScoreSubmission = useCallback((scoreData) => {
    // Handle score submission logic
    console.log('Score submission received:', scoreData);
    
    // Update player scores based on scoreData
    setPlayers(prevPlayers => 
      prevPlayers.map(player => ({
        ...player,
        score: player.score + (scoreData[player.id] || 0)
      }))
    );

    // Move to next phase or round
    setGamePhase('bidding');
    setCurrentHandCount(prevCount => Math.max(1, prevCount - 1));
  }, []);

  const handlePhaseChange = (newPhase) => {
    setGamePhase(newPhase);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Spades Game</h1>
        <div className="game-info">
          <span>Phase: {gamePhase}</span>
          <span>Hand: {currentHandCount}</span>
        </div>
      </div>

      <div className="players-info">
        {players.map(player => (
          <div key={player.id} className="player-info">
            <span>{player.name}: {player.score} points</span>
          </div>
        ))}
      </div>

      <div className="game-content">
        {gamePhase === 'bidding' && (
          <div className="bidding-phase">
            <h2>Bidding Phase</h2>
            <button onClick={() => handlePhaseChange('playing')}>Start Playing</button>
          </div>
        )}

        {gamePhase === 'playing' && (
          <div className="playing-phase">
            <h2>Playing Phase</h2>
            <button onClick={() => handlePhaseChange('scoreEntry')}>Enter Scores</button>
          </div>
        )}

        {gamePhase === 'scoreEntry' && (
          <ScoreEntry 
            players={players}
            bids={currentRoundBids}
            handCount={currentHandCount}
            onSubmit={handleScoreSubmission}
          />
        )}

        {gamePhase === 'gameOver' && (
          <div className="game-over">
            <h2>Game Over</h2>
            <button onClick={() => {
              setGamePhase('bidding');
              setCurrentHandCount(10);
              setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
            }}>New Game</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;