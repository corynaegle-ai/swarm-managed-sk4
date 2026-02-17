import React, { createContext, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const GameFlowContext = createContext();

export const useGameFlow = () => {
  const context = useContext(GameFlowContext);
  if (!context) {
    throw new Error('useGameFlow must be used within a GameFlowProvider');
  }
  return context;
};

export const GameFlowProvider = ({ children }) => {
  const dispatch = useDispatch();
  const gameState = useSelector(state => state.game);

  const nextPhase = useCallback(() => {
    dispatch({ type: 'NEXT_PHASE' });
  }, [dispatch]);

  const setPhase = useCallback((phase) => {
    dispatch({ type: 'SET_PHASE', payload: phase });
  }, [dispatch]);

  const incrementRound = useCallback(() => {
    dispatch({ type: 'INCREMENT_ROUND' });
  }, [dispatch]);

  const completePhase = useCallback(() => {
    dispatch({ type: 'COMPLETE_PHASE' });
  }, [dispatch]);

  const resetPhase = useCallback(() => {
    dispatch({ type: 'RESET_PHASE' });
  }, [dispatch]);

  const value = {
    gameState,
    nextPhase,
    setPhase,
    incrementRound,
    completePhase,
    resetPhase
  };

  return (
    <GameFlowContext.Provider value={value}>
      {children}
    </GameFlowContext.Provider>
  );
};

export default GameFlowContext;