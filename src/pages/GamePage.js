import React from 'react';
import { useGameFlow } from '../context/GameFlowContext';
import { GAME_PHASES } from '../context/GameFlowContext';

// Import phase components (these would need to be created separately)
import GameSetup from '../components/GameSetup';
import BiddingPhase from '../components/BiddingPhase';
import PlayingPhase from '../components/PlayingPhase';
import ScoringPhase from '../components/ScoringPhase';
import RoundResults from '../components/RoundResults';
import GameResults from '../components/GameResults';

function GamePage() {
  const { gameState, dispatch } = useGameFlow();

  const renderCurrentPhase = () => {
    try {
      switch (gameState.currentPhase) {
        case GAME_PHASES.SETUP:
          return <GameSetup />;
        case GAME_PHASES.BIDDING:
          return <BiddingPhase />;
        case GAME_PHASES.PLAYING:
          return <PlayingPhase />;
        case GAME_PHASES.SCORING:
          return <ScoringPhase />;
        case GAME_PHASES.RESULTS:
          return <RoundResults />;
        case GAME_PHASES.GAME_OVER:
          return <GameResults />;
        default:
          console.warn(`Unknown game phase: ${gameState.currentPhase}`);
          return <GameSetup />; // Fallback to setup
      }
    } catch (error) {
      console.error('Error rendering game phase:', error);
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>Please refresh the page and try again.</p>
        </div>
      );
    }
  };

  return (
    <div className="game-page">
      <div className="game-header">
        <h1>Skull King Game</h1>
        <div className="game-info">
          <span>Phase: {gameState.currentPhase}</span>
          <span>Round: {gameState.currentRound}</span>
        </div>
      </div>
      <div className="game-content">
        {renderCurrentPhase()}
      </div>
    </div>
  );
}

export default GamePage;