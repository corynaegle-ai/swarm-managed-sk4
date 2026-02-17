import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BiddingPhase from '../components/BiddingPhase';
import TrickPhase from '../components/TrickPhase';
import ScoringPhase from '../components/ScoringPhase';
import GameOverScreen from '../components/GameOverScreen';

const GamePage = () => {
  const dispatch = useDispatch();
  const gameState = useSelector(state => state.game);
  const { currentPhase, round, isPhaseComplete } = gameState;

  // Handle phase completion and automatic progression
  const handlePhaseComplete = () => {
    dispatch({ type: 'NEXT_PHASE' });
  };

  // Handle game completion logic
  const handleGameComplete = () => {
    if (round >= 10) {
      dispatch({ type: 'SET_PHASE', payload: 'gameOver' });
    } else {
      dispatch({ type: 'INCREMENT_ROUND' });
      dispatch({ type: 'SET_PHASE', payload: 'bidding' });
    }
  };

  // Auto-advance from scoring phase after 2 seconds
  useEffect(() => {
    let timer;
    if (currentPhase === 'scoring' && isPhaseComplete) {
      timer = setTimeout(() => {
        handlePhaseComplete();
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentPhase, isPhaseComplete]);

  // Progress indicator component
  const ProgressIndicator = () => (
    <div className="progress-indicator" style={{
      padding: '16px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333'
    }}>
      Round {round} of 10
      <div style={{
        width: '100%',
        backgroundColor: '#ddd',
        borderRadius: '10px',
        marginTop: '8px',
        height: '10px'
      }}>
        <div style={{
          width: `${(round / 10) * 100}%`,
          backgroundColor: '#4CAF50',
          height: '100%',
          borderRadius: '10px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );

  // Render appropriate phase component
  const renderPhaseComponent = () => {
    switch (currentPhase) {
      case 'bidding':
        return <BiddingPhase onComplete={handlePhaseComplete} />;
      case 'tricks':
        return <TrickPhase onComplete={handlePhaseComplete} />;
      case 'scoring':
        return (
          <ScoringPhase 
            onComplete={handlePhaseComplete}
            onGameComplete={handleGameComplete}
          />
        );
      case 'gameOver':
        return <GameOverScreen />;
      default:
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>Unknown game phase: {currentPhase}</h3>
            <button 
              onClick={handlePhaseComplete}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              Continue Game
            </button>
          </div>
        );
    }
  };

  return (
    <div className="game-page" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <ProgressIndicator />
      
      {renderPhaseComponent()}
      
      {/* Manual progression fallback button */}
      {currentPhase !== 'gameOver' && (
        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <button 
            onClick={handlePhaseComplete}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Manual Advance (Fallback)
          </button>
        </div>
      )}
    </div>
  );
};

export default GamePage;