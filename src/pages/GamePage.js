import React from 'react';
import { useGameFlow, GAME_PHASES } from '../context/GameFlowContext';

function GamePage() {
  const {
    currentPhase,
    roundNumber,
    totalRounds,
    players,
    scores,
    gameStarted,
    gameEnded,
    startGame,
    nextPhase,
    updateScores,
    resetGame
  } = useGameFlow();

  const handleStartGame = () => {
    const mockPlayers = [
      { id: 'player1', name: 'Player 1' },
      { id: 'player2', name: 'Player 2' },
      { id: 'player3', name: 'Player 3' },
      { id: 'player4', name: 'Player 4' }
    ];
    startGame(mockPlayers);
  };

  const handleUpdateScores = () => {
    const newScores = {};
    players.forEach(player => {
      newScores[player.id] = (scores[player.id] || 0) + Math.floor(Math.random() * 10) + 1;
    });
    updateScores(newScores);
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case GAME_PHASES.SETUP:
        return (
          <div>
            <h2>Game Setup</h2>
            <p>Welcome to Skull King! Set up your game here.</p>
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        );

      case GAME_PHASES.BIDDING:
        return (
          <div>
            <h2>Bidding Phase - Round {roundNumber}</h2>
            <p>Players make their bids for this round.</p>
            <button onClick={nextPhase}>Complete Bidding</button>
          </div>
        );

      case GAME_PHASES.PLAYING:
        return (
          <div>
            <h2>Playing Phase - Round {roundNumber}</h2>
            <p>Play your cards and try to meet your bid!</p>
            <button onClick={nextPhase}>Complete Playing</button>
          </div>
        );

      case GAME_PHASES.SCORING:
        return (
          <div>
            <h2>Scoring Phase - Round {roundNumber}</h2>
            <p>Calculate scores for this round.</p>
            <button onClick={handleUpdateScores}>Update Scores</button>
            <button onClick={nextPhase}>View Results</button>
          </div>
        );

      case GAME_PHASES.RESULTS:
        return (
          <div>
            <h2>Round {roundNumber} Results</h2>
            <div>
              <h3>Current Scores:</h3>
              {players.map(player => (
                <div key={player.id}>
                  {player.name}: {scores[player.id] || 0} points
                </div>
              ))}
            </div>
            <button onClick={nextPhase}>
              {roundNumber >= totalRounds ? 'End Game' : 'Next Round'}
            </button>
          </div>
        );

      case GAME_PHASES.GAME_OVER:
        return (
          <div>
            <h2>Game Over!</h2>
            <div>
              <h3>Final Scores:</h3>
              {players
                .sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
                .map((player, index) => (
                  <div key={player.id}>
                    {index + 1}. {player.name}: {scores[player.id] || 0} points
                  </div>
                ))}
            </div>
            <button onClick={resetGame}>Play Again</button>
          </div>
        );

      default:
        return <div>Unknown game phase</div>;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Skull King Game</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <strong>Current Phase:</strong> {currentPhase}<br />
        <strong>Round:</strong> {roundNumber} of {totalRounds}<br />
        <strong>Game Status:</strong> {gameEnded ? 'Ended' : gameStarted ? 'In Progress' : 'Not Started'}
      </div>

      {renderPhaseContent()}

      <div style={{ marginTop: '30px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Debug Actions:</h3>
        <button onClick={() => console.log('Current state:', { currentPhase, roundNumber, players, scores })} style={{ marginRight: '10px' }}>
          Log State
        </button>
        <button onClick={resetGame}>
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default GamePage;