import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game, { GAME_PHASES } from '../Game';

// Mock ScoreEntry component
jest.mock('../ScoreEntry', () => {
  return function MockScoreEntry({ onScoreSubmission, scoreEntryComplete }) {
    return (
      <div data-testid="score-entry">
        <button 
          onClick={() => onScoreSubmission({ player1: 10, player2: 8 })}
          data-testid="submit-scores"
        >
          Submit Scores
        </button>
        {scoreEntryComplete && <div data-testid="scores-submitted">Scores Submitted</div>}
      </div>
    );
  };
});

describe('Game Component', () => {
  test('renders game setup phase initially', () => {
    render(<Game />);
    expect(screen.getByText('Game Setup')).toBeInTheDocument();
    expect(screen.getByText('Phase: setup')).toBeInTheDocument();
  });

  test('transitions from setup to bidding phase', () => {
    render(<Game />);
    const startButton = screen.getByText('Start Bidding Phase');
    fireEvent.click(startButton);
    
    expect(screen.getByText('Bidding Phase - Round 1')).toBeInTheDocument();
    expect(screen.getByText('Phase: bidding')).toBeInTheDocument();
  });

  test('transitions from bidding to score entry phase', () => {
    render(<Game />);
    
    // Start bidding phase
    fireEvent.click(screen.getByText('Start Bidding Phase'));
    
    // Transition to score entry
    fireEvent.click(screen.getByText('Proceed to Score Entry'));
    
    expect(screen.getByText('Score Entry Phase - Round 1')).toBeInTheDocument();
    expect(screen.getByText('Phase: scoreEntry')).toBeInTheDocument();
    expect(screen.getByTestId('score-entry')).toBeInTheDocument();
  });

  test('handleScoreSubmission updates scoreEntryComplete state', () => {
    render(<Game />);
    
    // Navigate to score entry phase
    fireEvent.click(screen.getByText('Start Bidding Phase'));
    fireEvent.click(screen.getByText('Proceed to Score Entry'));
    
    // Submit scores
    const submitButton = screen.getByTestId('submit-scores');
    fireEvent.click(submitButton);
    
    expect(screen.getByTestId('scores-submitted')).toBeInTheDocument();
    expect(screen.getByText('Scores have been submitted successfully!')).toBeInTheDocument();
  });

  test('game phases are properly defined', () => {
    expect(GAME_PHASES.SETUP).toBe('setup');
    expect(GAME_PHASES.BIDDING).toBe('bidding');
    expect(GAME_PHASES.SCORE_ENTRY).toBe('scoreEntry');
    expect(GAME_PHASES.GAME_OVER).toBe('gameOver');
  });

  test('resets game state when starting new game', () => {
    render(<Game />);
    
    // Navigate through phases
    fireEvent.click(screen.getByText('Start Bidding Phase'));
    fireEvent.click(screen.getByText('Proceed to Score Entry'));
    fireEvent.click(screen.getByTestId('submit-scores'));
    fireEvent.click(screen.getByText('End Game'));
    
    // Start new game
    fireEvent.click(screen.getByText('New Game'));
    
    expect(screen.getByText('Game Setup')).toBeInTheDocument();
    expect(screen.getByText('Phase: setup')).toBeInTheDocument();
  });
});