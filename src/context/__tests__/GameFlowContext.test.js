import React from 'react';
import { render, act } from '@testing-library/react';
import { GameFlowProvider, useGameFlow } from '../GameFlowContext';

// Test component to access context
const TestComponent = () => {
  const { gameState, dispatch, actions } = useGameFlow();
  
  return (
    <div>
      <span data-testid="phase">{gameState.currentPhase}</span>
      <span data-testid="round">{gameState.round}</span>
      <span data-testid="complete">{gameState.isPhaseComplete.toString()}</span>
      <button 
        data-testid="next-phase" 
        onClick={() => actions.nextPhase()}
      >
        Next Phase
      </button>
      <button 
        data-testid="increment-round" 
        onClick={() => actions.incrementRound()}
      >
        Next Round
      </button>
      <button 
        data-testid="game-over" 
        onClick={() => actions.gameOver()}
      >
        Game Over
      </button>
    </div>
  );
};

describe('GameFlowContext', () => {
  it('provides initial state correctly', () => {
    const { getByTestId } = render(
      <GameFlowProvider>
        <TestComponent />
      </GameFlowProvider>
    );

    expect(getByTestId('phase')).toHaveTextContent('bidding');
    expect(getByTestId('round')).toHaveTextContent('1');
    expect(getByTestId('complete')).toHaveTextContent('false');
  });

  it('handles phase progression correctly', () => {
    const { getByTestId } = render(
      <GameFlowProvider>
        <TestComponent />
      </GameFlowProvider>
    );

    act(() => {
      getByTestId('next-phase').click();
    });
    expect(getByTestId('phase')).toHaveTextContent('playing');

    act(() => {
      getByTestId('next-phase').click();
    });
    expect(getByTestId('phase')).toHaveTextContent('scoring');

    act(() => {
      getByTestId('next-phase').click();
    });
    expect(getByTestId('phase')).toHaveTextContent('bidding');
  });

  it('handles round increment correctly', () => {
    const { getByTestId } = render(
      <GameFlowProvider>
        <TestComponent />
      </GameFlowProvider>
    );

    act(() => {
      getByTestId('increment-round').click();
    });
    expect(getByTestId('round')).toHaveTextContent('2');
    expect(getByTestId('phase')).toHaveTextContent('bidding');
  });

  it('handles game over correctly', () => {
    const { getByTestId } = render(
      <GameFlowProvider>
        <TestComponent />
      </GameFlowProvider>
    );

    act(() => {
      getByTestId('game-over').click();
    });
    expect(getByTestId('phase')).toHaveTextContent('gameOver');
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useGameFlow must be used within a GameFlowProvider');
    
    consoleSpy.mockRestore();
  });
});