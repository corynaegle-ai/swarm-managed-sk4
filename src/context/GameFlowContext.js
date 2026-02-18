import React, { createContext, useContext, useReducer } from 'react';

const GameFlowContext = createContext();

const initialState = {
  currentPhase: 'bidding',
  round: 1,
  isPhaseComplete: false,
  gameOver: false
};

const gameFlowReducer = (state, action) => {
  switch (action.type) {
    case 'NEXT_PHASE':
      const phaseOrder = ['bidding', 'playing', 'scoring'];
      const currentIndex = phaseOrder.indexOf(state.currentPhase);
      const nextPhase = phaseOrder[(currentIndex + 1) % phaseOrder.length];
      
      return {
        ...state,
        currentPhase: nextPhase,
        isPhaseComplete: false
      };
    
    case 'SET_PHASE_COMPLETE':
      return {
        ...state,
        isPhaseComplete: true
      };
    
    case 'SET_PHASE':
      return {
        ...state,
        currentPhase: action.payload,
        isPhaseComplete: false
      };
    
    case 'INCREMENT_ROUND':
      return {
        ...state,
        round: state.round + 1,
        currentPhase: 'bidding',
        isPhaseComplete: false
      };
    
    case 'GAME_OVER':
      return {
        ...state,
        currentPhase: 'gameOver',
        gameOver: true,
        isPhaseComplete: false
      };
    
    case 'RESET_GAME':
      return initialState;
    
    default:
      return state;
  }
};

export const GameFlowProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameFlowReducer, initialState);

  return (
    <GameFlowContext.Provider value={{ gameState, dispatch }}>
      {children}
    </GameFlowContext.Provider>
  );
};

export const useGameFlow = () => {
  const context = useContext(GameFlowContext);
  if (!context) {
    throw new Error('useGameFlow must be used within a GameFlowProvider');
  }
  return context;
};