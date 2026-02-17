import React, { useState, useEffect } from 'react';
import ScoreEntry from './ScoreEntry';

// Game phase constants
const GAME_PHASES = {
  SETUP: 'setup',
  BIDDING: 'bidding',
  SCORE_ENTRY: 'scoreEntry',
  GAME_OVER: 'gameOver'
};

const Game = () => {
  const [gamePhase, setGamePhase] = useState(GAME_PHASES.SETUP);
  const [scoreEntryComplete, setScoreEntryComplete] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [bids, setBids] = useState({});

  // Handle score submission from ScoreEntry component
  const handleScoreSubmission = (scores) => {
    console.log('Scores submitted:', scores);
    setScoreEntryComplete(true);
    // Additional logic for processing scores can be added here
  };

  // Transition from bidding phase to score entry phase
  const transitionToScoreEntry = () => {
    if (gamePhase === GAME_PHASES.BIDDING) {
      setGamePhase(GAME_PHASES.SCORE_ENTRY);
      setScoreEntryComplete(false);
    }
  };

  // Handle phase transitions
  useEffect(() => {
    if (gamePhase === GAME_PHASES.BIDDING && Object.keys(bids).length === players.length) {
      // All players have bid, transition to score entry
      transitionToScoreEntry();
    }
  }, [bids, players, gamePhase]);

  // Render different components based on game phase
  const renderGameContent = () => {
    switch (gamePhase) {
      case GAME_PHASES.SETUP:
        return (
          <div className="game-setup">
            <h2>Game Setup</h2>
            <p>Setting up the game...</p>
            <button onClick={() => setGamePhase(GAME_PHASES.BIDDING)}>
              Start Bidding Phase
            </button>
          </div>
        );
      
      case GAME_PHASES.BIDDING:
        return (
          <div className="bidding-phase">
            <h2>Bidding Phase - Round {currentRound}</h2>
            <p>Players are placing their bids...</p>
            <button onClick={transitionToScoreEntry}>
              Proceed to Score Entry
            </button>
          </div>
        );
      
      case GAME_PHASES.SCORE_ENTRY:
        return (
          <div className="score-entry-phase">
            <h2>Score Entry Phase - Round {currentRound}</h2>
            <ScoreEntry 
              onScoreSubmission={handleScoreSubmission}
              players={players}
              bids={bids}
              scoreEntryComplete={scoreEntryComplete}
            />
            {scoreEntryComplete && (
              <div className="score-entry-complete">
                <p>Scores have been submitted successfully!</p>
                <button onClick={() => setGamePhase(GAME_PHASES.GAME_OVER)}>
                  End Game
                </button>
              </div>
            )}
          </div>
        );
      
      case GAME_PHASES.GAME_OVER:
        return (
          <div className="game-over">
            <h2>Game Over</h2>
            <p>Thanks for playing!</p>
            <button onClick={() => {
              setGamePhase(GAME_PHASES.SETUP);
              setScoreEntryComplete(false);
              setBids({});
              setCurrentRound(1);
            }}>
              New Game
            </button>
          </div>
        );
      
      default:
        return <div>Unknown game phase</div>;
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Spades Game</h1>
        <div className="game-status">
          <span>Phase: {gamePhase}</span>
          <span>Round: {currentRound}</span>
        </div>
      </div>
      <div className="game-content">
        {renderGameContent()}
      </div>
    </div>
  );
};

export default Game;
export { GAME_PHASES };