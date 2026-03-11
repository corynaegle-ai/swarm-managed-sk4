import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameFlowProvider, useGameFlow, GAME_PHASES, GAME_ACTIONS } from './GameFlowContext';

// Test component to access context
function TestComponent() {
  const { gameState, dispatch } = useGameFlow();
  
  return (
    <div>
      <span data-testid="current-phase">{gameState.currentPhase}</span>
      <button
        data-testid="change-phase"
        onClick={() => dispatch({ type: GAME_ACTIONS.SET_PHASE, payload: GAME_PHASES.BIDDING })}
      >
        Change Phase
      </button>
    </div>
  );
}

describe('GameFlowContext', () => {
  test('provides initial state', () => {
    render(
      <GameFlowProvider>
        <TestComponent />
      </GameFlowProvider>
    );
    
    expect(screen.getByTestId('current-phase')).toHaveTextContent('setup');
  });

  test('throws error when used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useGameFlow must be used within a GameFlowProvider');
    
    consoleSpy.mockRestore();
  });
});