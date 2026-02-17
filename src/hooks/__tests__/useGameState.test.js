import { renderHook, act } from '@testing-library/react';
import { useGameState } from '../useGameState';

describe('useGameState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useGameState());
    
    expect(result.current.gameState.players).toEqual([]);
    expect(result.current.gameState.rounds).toEqual([]);
    expect(result.current.currentRound).toBe(1);
    expect(result.current.isGameStarted).toBe(false);
  });

  it('should add players correctly', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
    });
    
    expect(result.current.gameState.players).toEqual(['Alice', 'Bob']);
    expect(result.current.totalPlayers).toBe(2);
  });

  it('should prevent duplicate players', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Alice');
    });
    
    expect(result.current.gameState.players).toEqual(['Alice']);
  });

  it('should add rounds and calculate scores', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
      result.current.addRound({ Alice: 10, Bob: 15 });
      result.current.addRound({ Alice: 20, Bob: 10 });
    });
    
    expect(result.current.gameState.rounds).toHaveLength(2);
    expect(result.current.cumulativeScores).toEqual({ Alice: 30, Bob: 25 });
    expect(result.current.currentRound).toBe(3);
    expect(result.current.isGameStarted).toBe(true);
  });

  it('should update player scores correctly', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addPlayer('Alice');
      result.current.addRound({ Alice: 10 });
    });
    
    act(() => {
      result.current.updatePlayerScore(0, 'Alice', 25);
    });
    
    expect(result.current.gameState.rounds[0].scores.Alice).toBe(25);
    expect(result.current.cumulativeScores.Alice).toBe(25);
  });

  it('should get player history correctly', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addPlayer('Alice');
      result.current.addRound({ Alice: 10 });
      result.current.addRound({ Alice: 20 });
    });
    
    const history = result.current.getPlayerHistory('Alice');
    expect(history).toHaveLength(2);
    expect(history[0].score).toBe(10);
    expect(history[1].score).toBe(20);
  });

  it('should calculate rankings correctly', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
      result.current.addPlayer('Charlie');
      result.current.addRound({ Alice: 30, Bob: 50, Charlie: 20 });
    });
    
    const rankings = result.current.rankings;
    expect(rankings[0].name).toBe('Bob');
    expect(rankings[0].rank).toBe(1);
    expect(rankings[1].name).toBe('Alice');
    expect(rankings[2].name).toBe('Charlie');
  });

  it('should reset game correctly', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      result.current.addPlayer('Alice');
      result.current.addRound({ Alice: 10 });
    });
    
    act(() => {
      result.current.resetGame();
    });
    
    expect(result.current.gameState.players).toEqual([]);
    expect(result.current.gameState.rounds).toEqual([]);
    expect(result.current.isGameStarted).toBe(false);
  });

  it('should handle error cases gracefully', () => {
    const { result } = renderHook(() => useGameState());
    
    act(() => {
      const success1 = result.current.addPlayer('');
      const success2 = result.current.updatePlayerScore(-1, 'Alice', 10);
      const success3 = result.current.addRound(null);
      
      expect(success1).toBe(false);
      expect(success2).toBe(false);
      expect(success3).toBe(false);
    });
  });
});