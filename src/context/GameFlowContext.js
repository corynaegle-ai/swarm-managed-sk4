import React, { createContext, useContext, useReducer } from 'react';

// Initial game state
const initialState = {
  currentPhase: 'bidding', // 'bidding', 'playing', 'scoring', 'gameOver'
  round: 1,
  isPhaseComplete: false,
  gameData: {
    bids: {},
    tricks: [],
    scores: {}
  }
};

// Game flow reducer
const gameFlowReducer = (state, action) => {
  switch (action.type) {
    case 'NEXT_PHASE':
      const phaseOrder = ['bidding', 'playing', 'scoring'];
      const currentIndex = phaseOrder.indexOf(state.currentPhase);
      const nextIndex = (currentIndex + 1) % phaseOrder.length;
      
      return {
        ...state,
        currentPhase: phaseOrder[nextIndex],
        isPhaseComplete: false
      };
    
    case 'SET_PHASE_COMPLETE':
      return {
        ...state,
        isPhaseComplete: true
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
        isPhaseComplete: false
      };
    
    case 'RESET_GAME':
      return {
        ...initialState
      };
    
    case 'SET_BID':
      return {
        ...state,
        gameData: {
          ...state.gameData,
          bids: {
            ...state.gameData.bids,
            [action.payload.playerId]: action.payload.bid
          }
        }
      };
    
    case 'ADD_TRICK':
      return {
        ...state,
        gameData: {
          ...state.gameData,
          tricks: [...state.gameData.tricks, action.payload.trick]
        }
      };
    
    case 'UPDATE_SCORES':
      return {
        ...state,
        gameData: {
          ...state.gameData,
          scores: {
            ...state.gameData.scores,
            ...action.payload.scores
          }
        }
      };
    
    default:
      console.warn(`Unknown action type: ${action.type}`);
      return state;
  }
};

// Create context
const GameFlowContext = createContext();

// Context provider component
export const GameFlowProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameFlowReducer, initialState);

  // Derived values for convenience
  const isGameComplete = gameState.round > 10;
  const currentRoundDisplay = Math.min(gameState.round, 10);
  
  const contextValue = {
    gameState: {
      ...gameState,
      isGameComplete,
      currentRoundDisplay
    },
    dispatch,
    // Action creators for convenience
    actions: {
      nextPhase: () => dispatch({ type: 'NEXT_PHASE' }),
      setPhaseComplete: () => dispatch({ type: 'SET_PHASE_COMPLETE' }),
      incrementRound: () => dispatch({ type: 'INCREMENT_ROUND' }),
      gameOver: () => dispatch({ type: 'GAME_OVER' }),
      resetGame: () => dispatch({ type: 'RESET_GAME' }),
      setBid: (playerId, bid) => dispatch({ 
        type: 'SET_BID', 
        payload: { playerId, bid } 
      }),
      addTrick: (trick) => dispatch({ 
        type: 'ADD_TRICK', 
        payload: { trick } 
      }),
      updateScores: (scores) => dispatch({ 
        type: 'UPDATE_SCORES', 
        payload: { scores } 
      })
    }
  };

  return (
    <GameFlowContext.Provider value={contextValue}>
      {children}
    </GameFlowContext.Provider>
  );
};

// Custom hook to use game flow context
export const useGameFlow = () => {
  const context = useContext(GameFlowContext);
  
  if (!context) {
    throw new Error('useGameFlow must be used within a GameFlowProvider');
  }
  
  return context;
};

// Export context for testing purposes
export { GameFlowContext };