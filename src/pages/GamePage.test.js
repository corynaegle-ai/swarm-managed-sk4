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

// Mock the useGameFlow hook to allow custom initial states
const mockUseGameFlow = jest.fn();

jest.mock('../context/GameFlowContext', () => ({
  ...jest.requireActual('../context/GameFlowContext'),
  useGameFlow: () => mockUseGameFlow(),
  GAME_PHASES: {
    SETUP: 'setup',
    BIDDING: 'bidding',
    PLAYING: 'playing',
    SCORING: 'scoring',
    RESULTS: 'results',
    GAME_OVER: 'gameOver'
  }
}));

function renderGamePage(customState = {}) {
  const defaultState = {
    currentPhase: GAME_PHASES.SETUP,
    currentRound: 1,
    players: [],
    ...customState
  };
  
  mockUseGameFlow.mockReturnValue({
    gameState: defaultState,
    dispatch: jest.fn()
  });
  
  return render(
    <GameFlowProvider>
      <GamePage />
    </GameFlowProvider>
  );
}

describe('GamePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders setup phase by default', () => {
    renderGamePage();
    
    expect(screen.getByTestId('game-setup')).toBeInTheDocument();
    expect(screen.getByText('Phase: setup')).toBeInTheDocument();
  });

  test('renders bidding phase when currentPhase is bidding', () => {
    renderGamePage({ currentPhase: GAME_PHASES.BIDDING });
    
    expect(screen.getByTestId('bidding-phase')).toBeInTheDocument();
    expect(screen.getByText('Phase: bidding')).toBeInTheDocument();
  });

  test('renders playing phase when currentPhase is playing', () => {
    renderGamePage({ currentPhase: GAME_PHASES.PLAYING });
    
    expect(screen.getByTestId('playing-phase')).toBeInTheDocument();
    expect(screen.getByText('Phase: playing')).toBeInTheDocument();
  });

  test('renders scoring phase when currentPhase is scoring', () => {
    renderGamePage({ currentPhase: GAME_PHASES.SCORING });
    
    expect(screen.getByTestId('scoring-phase')).toBeInTheDocument();
    expect(screen.getByText('Phase: scoring')).toBeInTheDocument();
  });

  test('renders round results when currentPhase is results', () => {
    renderGamePage({ currentPhase: GAME_PHASES.RESULTS });
    
    expect(screen.getByTestId('round-results')).toBeInTheDocument();
    expect(screen.getByText('Phase: results')).toBeInTheDocument();
  });

  test('renders game results when currentPhase is gameOver', () => {
    renderGamePage({ currentPhase: GAME_PHASES.GAME_OVER });
    
    expect(screen.getByTestId('game-results')).toBeInTheDocument();
    expect(screen.getByText('Phase: gameOver')).toBeInTheDocument();
  });

  test('only renders the current phase component', () => {
    renderGamePage({ currentPhase: GAME_PHASES.BIDDING });
    
    expect(screen.getByTestId('bidding-phase')).toBeInTheDocument();
    expect(screen.queryByTestId('game-setup')).not.toBeInTheDocument();
    expect(screen.queryByTestId('playing-phase')).not.toBeInTheDocument();
    expect(screen.queryByTestId('scoring-phase')).not.toBeInTheDocument();
    expect(screen.queryByTestId('round-results')).not.toBeInTheDocument();
    expect(screen.queryByTestId('game-results')).not.toBeInTheDocument();
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

  test('updates round number based on gameState', () => {
    renderGamePage({ currentRound: 5 });
    
    expect(screen.getByText('Round: 5')).toBeInTheDocument();
  });
});