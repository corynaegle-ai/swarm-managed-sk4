import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GamePage from '../src/pages/GamePage';

// Mock components
jest.mock('../src/components/BiddingPhase', () => {
  return function BiddingPhase({ onComplete }) {
    return (
      <div>
        <span>Bidding Phase</span>
        <button onClick={onComplete}>Complete Bidding</button>
      </div>
    );
  };
});

jest.mock('../src/components/ScoringPhase', () => {
  return function ScoringPhase({ onComplete }) {
    return (
      <div>
        <span>Scoring Phase</span>
        <button onClick={onComplete}>Complete Scoring</button>
      </div>
    );
  };
});

jest.mock('../src/components/GameOverScreen', () => {
  return function GameOverScreen() {
    return <div>Game Over</div>;
  };
});

const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      game: (state = initialState.game, action) => {
        switch (action.type) {
          case 'NEXT_PHASE':
            return { ...state, currentPhase: 'tricks' };
          case 'SET_PHASE':
            return { ...state, currentPhase: action.payload };
          default:
            return state;
        }
      }
    }
  });
};

describe('GamePage', () => {
  test('displays progress indicator with current round', () => {
    const store = createMockStore({
      game: {
        currentPhase: 'bidding',
        round: 3,
        isPhaseComplete: false
      }
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
    const store = createMockStore({
      game: {
        currentPhase: 'scoring',
        round: 3,
        isPhaseComplete: true
      }
    });

    render(
      <Provider store={store}>
        <GamePage />
      </Provider>
    );

    // Fast-forward 2 seconds
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(store.getState().game.currentPhase).toBe('tricks');
    });

    jest.useRealTimers();
  });

  test('shows game over screen after round 10', () => {
    const store = createMockStore({
      game: {
        currentPhase: 'gameOver',
        round: 10,
        isPhaseComplete: false
      }
    });

    render(
      <Provider store={store}>
        <GamePage />
      </Provider>
    );

    expect(screen.getByText('Game Over')).toBeInTheDocument();
  });

  test('provides manual progression fallback', () => {
    const store = createMockStore({
      game: {
        currentPhase: 'bidding',
        round: 1,
        isPhaseComplete: false
      }
    });

    render(
      <Provider store={store}>
        <GamePage />
      </Provider>
    );

    expect(screen.getByText('Manual Advance (Fallback)')).toBeInTheDocument();
  });
});