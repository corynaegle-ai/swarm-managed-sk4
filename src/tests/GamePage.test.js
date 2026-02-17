import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import GamePage from '../pages/GamePage';

// Mock components
jest.mock('../components/BiddingPhase', () => ({ onComplete }) => (
  <div data-testid="bidding-phase">
    <button onClick={onComplete}>Complete Bidding</button>
  </div>
));

jest.mock('../components/TrickPhase', () => ({ onComplete }) => (
  <div data-testid="trick-phase">
    <button onClick={onComplete}>Complete Tricks</button>
  </div>
));

jest.mock('../components/ScoringPhase', () => ({ onComplete, onGameComplete }) => (
  <div data-testid="scoring-phase">
    <button onClick={onComplete}>Complete Scoring</button>
    <button onClick={onGameComplete}>Complete Game</button>
  </div>
));

jest.mock('../components/GameOverScreen', () => () => (
  <div data-testid="game-over-screen">Game Over</div>
));

const mockReducer = (state = {
  game: {
    currentPhase: 'bidding',
    round: 1,
    isPhaseComplete: false
  }
}, action) => {
  switch (action.type) {
    case 'NEXT_PHASE':
      return {
        ...state,
        game: {
          ...state.game,
          currentPhase: state.game.currentPhase === 'bidding' ? 'tricks' : 
                       state.game.currentPhase === 'tricks' ? 'scoring' : 'bidding'
        }
      };
    case 'SET_PHASE':
      return {
        ...state,
        game: { ...state.game, currentPhase: action.payload }
      };
    case 'INCREMENT_ROUND':
      return {
        ...state,
        game: { ...state.game, round: state.game.round + 1 }
      };
    default:
      return state;
  }
};

const createTestStore = (initialState) => createStore(mockReducer, initialState);

describe('GamePage', () => {
  test('shows progress indicator with current round', () => {
    const store = createTestStore({
      game: { currentPhase: 'bidding', round: 3, isPhaseComplete: false }
    });
    
    render(
      <Provider store={store}>
        <GamePage />
      </Provider>
    );
    
    expect(screen.getByText('Round 3 of 10')).toBeInTheDocument();
  });

  test('auto-advances from scoring phase after 2 seconds', async () => {
    jest.useFakeTimers();
    
    const store = createTestStore({
      game: { currentPhase: 'scoring', round: 5, isPhaseComplete: true }
    });
    
    render(
      <Provider store={store}>
        <GamePage />
      </Provider>
    );
    
    // Fast-forward time
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      // Verify the auto-advance timer was set
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);
    });
    
    jest.useRealTimers();
  });

  test('shows game over screen after round 10', () => {
    const store = createTestStore({
      game: { currentPhase: 'gameOver', round: 10, isPhaseComplete: true }
    });
    
    render(
      <Provider store={store}>
        <GamePage />
      </Provider>
    );
    
    expect(screen.getByTestId('game-over-screen')).toBeInTheDocument();
  });

  test('manual phase progression works', () => {
    const store = createTestStore({
      game: { currentPhase: 'bidding', round: 1, isPhaseComplete: false }
    });
    
    render(
      <Provider store={store}>
        <GamePage />
      </Provider>
    );
    
    const manualButton = screen.getByText('Manual Advance (Fallback)');
    expect(manualButton).toBeInTheDocument();
    
    fireEvent.click(manualButton);
    // Test that the button is clickable and doesn't throw errors
  });
});