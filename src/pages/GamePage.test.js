import React from 'react';
import { render, screen } from '@testing-library/react';
import GamePage from './GamePage';
import { GameFlowProvider, GAME_PHASES } from '../context/GameFlowContext';

// Mock the phase components
jest.mock('../components/GameSetup', () => {
  return function GameSetup() {
    return <div data-testid="game-setup">Game Setup</div>;
  };
});

jest.mock('../components/BiddingPhase', () => {
  return function BiddingPhase() {
    return <div data-testid="bidding-phase">Bidding Phase</div>;
  };
});

jest.mock('../components/PlayingPhase', () => {
  return function PlayingPhase() {
    return <div data-testid="playing-phase">Playing Phase</div>;
  };
});

jest.mock('../components/ScoringPhase', () => {
  return function ScoringPhase() {
    return <div data-testid="scoring-phase">Scoring Phase</div>;
  };
});

jest.mock('../components/RoundResults', () => {
  return function RoundResults() {
    return <div data-testid="round-results">Round Results</div>;
  };
});

jest.mock('../components/GameResults', () => {
  return function GameResults() {
    return <div data-testid="game-results">Game Results</div>;
  };
});

function renderGamePage(initialState = {}) {
  return render(
    <GameFlowProvider>
      <GamePage />
    </GameFlowProvider>
  );
}

describe('GamePage', () => {
  test('renders setup phase by default', () => {
    renderGamePage();
    
    expect(screen.getByTestId('game-setup')).toBeInTheDocument();
    expect(screen.getByText('Phase: setup')).toBeInTheDocument();
  });

  test('renders without console errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderGamePage();
    
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('displays game header information', () => {
    renderGamePage();
    
    expect(screen.getByText('Skull King Game')).toBeInTheDocument();
    expect(screen.getByText('Round: 1')).toBeInTheDocument();
  });
});