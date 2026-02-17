import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Game from '../Game';

// Mock ScoreEntry component
jest.mock('../ScoreEntry', () => {
  return function MockScoreEntry({ players, bids, handCount, onSubmit }) {
    return (
      <div data-testid="score-entry">
        <div data-testid="players-count">{players.length}</div>
        <div data-testid="hand-count">{handCount}</div>
        <button onClick={() => onSubmit({ 1: 10, 2: 20 })}>Submit Scores</button>
      </div>
    );
  };
});

describe('Game Component', () => {
  test('renders ScoreEntry component when gamePhase is scoreEntry', () => {
    render(<Game />);
    
    // Navigate to score entry phase
    fireEvent.click(screen.getByText('Start Playing'));
    fireEvent.click(screen.getByText('Enter Scores'));
    
    expect(screen.getByTestId('score-entry')).toBeInTheDocument();
  });

  test('passes players prop to ScoreEntry', () => {
    render(<Game />);
    
    // Navigate to score entry phase
    fireEvent.click(screen.getByText('Start Playing'));
    fireEvent.click(screen.getByText('Enter Scores'));
    
    expect(screen.getByTestId('players-count')).toHaveTextContent('4');
  });

  test('passes handCount prop to ScoreEntry', () => {
    render(<Game />);
    
    // Navigate to score entry phase
    fireEvent.click(screen.getByText('Start Playing'));
    fireEvent.click(screen.getByText('Enter Scores'));
    
    expect(screen.getByTestId('hand-count')).toHaveTextContent('10');
  });

  test('handles score submission from ScoreEntry', () => {
    render(<Game />);
    
    // Navigate to score entry phase
    fireEvent.click(screen.getByText('Start Playing'));
    fireEvent.click(screen.getByText('Enter Scores'));
    
    // Submit scores
    fireEvent.click(screen.getByText('Submit Scores'));
    
    // Should return to bidding phase
    expect(screen.getByText('Bidding Phase')).toBeInTheDocument();
  });

  test('does not render ScoreEntry when gamePhase is not scoreEntry', () => {
    render(<Game />);
    
    expect(screen.queryByTestId('score-entry')).not.toBeInTheDocument();
  });
});