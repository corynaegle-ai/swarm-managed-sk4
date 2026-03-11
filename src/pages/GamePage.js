import React, { useState, useEffect } from 'react';
import { useGameFlow } from '../context/GameFlowContext';
import BiddingPhase from '../components/BiddingPhase';
import PlayingPhase from '../components/PlayingPhase';
import ScoringPhase from '../components/ScoringPhase';
import GameOverScreen from '../components/GameOverScreen';
import './GamePage.css';

const GamePage = () => {
  const { gameState, dispatch } = useGameFlow();
  const [players] = useState([
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
    { id: 3, name: 'Player 3', score: 0 },
    { id: 4, name: 'Player 4', score: 0 }
  ]);

  // Handle phase completion
  const handlePhaseComplete = () => {
    dispatch({ type: 'NEXT_PHASE' });
  };

  // Handle game completion
  const handleGameComplete = () => {
    if (gameState.round >= 10) {
      dispatch({ type: 'GAME_OVER' });
    } else {
      dispatch({ type: 'INCREMENT_ROUND' });
    }
  };

  // Auto-advance from scoring phase after 2 seconds
  useEffect(() => {
    if (gameState.currentPhase === 'scoring' && gameState.isPhaseComplete) {
      const timer = setTimeout(() => {
        handleGameComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPhase, gameState.isPhaseComplete, gameState.round]);

  // Mark scoring phase as complete when it loads
  useEffect(() => {
    if (gameState.currentPhase === 'scoring' && !gameState.isPhaseComplete) {
      dispatch({ type: 'SET_PHASE_COMPLETE' });
    }
  }, [gameState.currentPhase, gameState.isPhaseComplete]);

  const renderCurrentPhase = () => {
    switch (gameState.currentPhase) {
      case 'bidding':
        return (
          <BiddingPhase
            players={players}
            round={gameState.round}
            onComplete={handlePhaseComplete}
          />
        );
      case 'playing':
        return (
          <PlayingPhase
            players={players}
            round={gameState.round}
            onComplete={handlePhaseComplete}
          />
        );
      case 'scoring':
        return (
          <ScoringPhase
            players={players}
            round={gameState.round}
            onComplete={handlePhaseComplete}
          />
        );
      case 'gameOver':
        return (
          <GameOverScreen
            players={players}
            onRestart={() => dispatch({ type: 'RESET_GAME' })}
          />
        );
      default:
        return <div>Unknown phase</div>;
    }
  };

  const getPhaseTitle = () => {
    switch (gameState.currentPhase) {
      case 'bidding':
        return 'Bidding Phase';
      case 'playing':
        return 'Playing Phase';
      case 'scoring':
        return 'Scoring Phase';
      case 'gameOver':
        return 'Game Over';
      default:
        return 'Game';
    }
  };

  return (
    <div className="game-page">
      <header className="game-header">
        <div className="game-progress">
          <h2 className="game-title">{getPhaseTitle()}</h2>
          {gameState.currentPhase !== 'gameOver' && (
            <div className="round-indicator">
              <span className="round-text">Round {gameState.round} of 10</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(gameState.round / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Manual progression buttons for fallback */}
        {gameState.currentPhase !== 'gameOver' && (
          <div className="manual-controls">
            <button 
              onClick={handlePhaseComplete}
              className="manual-next-btn"
              title="Manual phase progression"
            >
              Next Phase
            </button>
            {gameState.currentPhase === 'scoring' && (
              <button 
                onClick={handleGameComplete}
                className="manual-complete-btn"
                title="Manual game completion"
              >
                Complete Round
              </button>
            )}
          </div>
        )}
      </header>

      <main className="game-content">
        {renderCurrentPhase()}
      </main>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <small>
            Phase: {gameState.currentPhase} | 
            Round: {gameState.round} | 
            Complete: {gameState.isPhaseComplete ? 'Yes' : 'No'}
          </small>
        </div>
      )}
    </div>
  );
};

export default GamePage;