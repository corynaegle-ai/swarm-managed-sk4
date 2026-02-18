import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameFlowProvider } from '../context/GameFlowContext';
import GamePage from './GamePage';

// Mock components
jest.mock('../components/BiddingPhase', () => ({ onComplete }) => (
  <div data-testid="bidding-phase">
    <button onClick={onComplete}>Complete Bidding</button>
  </div>
));

jest.mock('../components/PlayingPhase', () => ({ onComplete }) => (
  <div data-testid="playing-phase">
    <button onClick={onComplete}>Complete Playing</button>
  </div>
));

jest.mock('../components/ScoringPhase', () => ({ onComplete }) => (
  <div data-testid="scoring-phase">
    Scoring Phase
  </div>
));

jest.mock('../components/GameOverScreen', () => ({ onRestart }) => (
  <div data-testid="game-over-screen">
    <button onClick={onRestart}>Restart Game</button>
  </div>
));

const renderWithProvider = (component) => {
  return render(
    <GameFlowProvider>
      {component}
    </GameFlowProvider>
  );
};

describe('GamePage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('shows progress indicator with current round', () => {
    renderWithProvider(<GamePage />);
    
    expect(screen.getByText('Round 1 of 10')).toBeInTheDocument();
    expect(screen.getByText('Bidding Phase')).toBeInTheDocument();
  });

  test('manual phase progression works', () => {
    renderWithProvider(<GamePage />);
    
    // Start with bidding phase
    expect(screen.getByTestId('bidding-phase')).toBeInTheDocument();
    
    // Click manual next button
    fireEvent.click(screen.getByText('Next Phase'));
    
    // Should advance to playing phase
    expect(screen.getByTestId('playing-phase')).toBeInTheDocument();
  });

  test('automatically advances from scoring phase after 2 seconds', async () => {
    renderWithProvider(<GamePage />);
    
    // Navigate to scoring phase
    fireEvent.click(screen.getByText('Next Phase')); // to playing
    fireEvent.click(screen.getByText('Next Phase')); // to scoring
    
    expect(screen.getByTestId('scoring-phase')).toBeInTheDocument();
    
    // Fast-forward 2 seconds
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      // Should advance to next round (bidding phase)
      expect(screen.getByTestId('bidding-phase')).toBeInTheDocument();
      expect(screen.getByText('Round 2 of 10')).toBeInTheDocument();
    });
  });

  test('shows game completion screen after round 10', async () => {
    renderWithProvider(<GamePage />);
    
    // Simulate completing 10 rounds by manually advancing through phases
    for (let round = 1; round <= 10; round++) {
      // Go through bidding and playing phases
      if (round > 1) {
        fireEvent.click(screen.getByText('Next Phase')); // to playing
        fireEvent.click(screen.getByText('Next Phase')); // to scoring
      } else {
        fireEvent.click(screen.getByText('Next Phase')); // to playing
        fireEvent.click(screen.getByText('Next Phase')); // to scoring
      }
      
      // If this is round 10, should show game over
      if (round === 10) {
        jest.advanceTimersByTime(2000);
        await waitFor(() => {
          expect(screen.getByTestId('game-over-screen')).toBeInTheDocument();
        });
        break;
      } else {
        // Otherwise advance to next round
        jest.advanceTimersByTime(2000);
        await waitFor(() => {
          expect(screen.getByText(`Round ${round + 1} of 10`)).toBeInTheDocument();
        });
      }
    }
  });

  test('manual game completion works when automatic fails', () => {
    renderWithProvider(<GamePage />);
    
    // Navigate to scoring phase
    fireEvent.click(screen.getByText('Next Phase')); // to playing
    fireEvent.click(screen.getByText('Next Phase')); // to scoring
    
    // Use manual complete button
    fireEvent.click(screen.getByText('Complete Round'));
    
    // Should advance to next round
    expect(screen.getByText('Round 2 of 10')).toBeInTheDocument();
    expect(screen.getByTestId('bidding-phase')).toBeInTheDocument();
  });
});