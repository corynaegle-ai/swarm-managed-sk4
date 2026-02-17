import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Game phases
export const GAME_PHASES = {
  SETUP: 'setup',
  BIDDING: 'bidding',
  PLAYING: 'playing',
  SCORING: 'scoring',
  RESULTS: 'results',
  GAME_OVER: 'gameOver'
};

// Action types
export const GAME_ACTIONS = {
  START_GAME: 'START_GAME',
  NEXT_PHASE: 'NEXT_PHASE',
  UPDATE_SCORES: 'UPDATE_SCORES',
  RESET_GAME: 'RESET_GAME'
};

// Initial state
const initialState = {
  currentPhase: GAME_PHASES.SETUP,
  roundNumber: 1,
  totalRounds: 10,
  players: [],
  currentPlayerIndex: 0,
  scores: {},
  gameStarted: false,
  gameEnded: false
};

// Game flow reducer
function gameFlowReducer(state, action) {
  switch (action.type) {
    case GAME_ACTIONS.START_GAME:
      return {
        ...state,
        gameStarted: true,
        currentPhase: GAME_PHASES.BIDDING,
        players: action.payload.players || [],
        scores: action.payload.players?.reduce((acc, player) => ({
          ...acc,
          [player.id]: 0
        }), {}) || {}
      };

    case GAME_ACTIONS.NEXT_PHASE:
      const phaseOrder = [
        GAME_PHASES.SETUP,
        GAME_PHASES.BIDDING,
        GAME_PHASES.PLAYING,
        GAME_PHASES.SCORING,
        GAME_PHASES.RESULTS
      ];
      
      const currentIndex = phaseOrder.indexOf(state.currentPhase);
      let nextPhase;
      
      if (currentIndex === phaseOrder.length - 1) {
        // End of round, check if game is over
        if (state.roundNumber >= state.totalRounds) {
          nextPhase = GAME_PHASES.GAME_OVER;
        } else {
          nextPhase = GAME_PHASES.BIDDING;
        }
      } else {
        nextPhase = phaseOrder[currentIndex + 1];
      }
      
      return {
        ...state,
        currentPhase: nextPhase,
        roundNumber: nextPhase === GAME_PHASES.BIDDING && state.currentPhase === GAME_PHASES.RESULTS 
          ? state.roundNumber + 1 
          : state.roundNumber,
        gameEnded: nextPhase === GAME_PHASES.GAME_OVER
      };

    case GAME_ACTIONS.UPDATE_SCORES:
      return {
        ...state,
        scores: {
          ...state.scores,
          ...action.payload.scores
        }
      };

    case GAME_ACTIONS.RESET_GAME:
      return {
        ...initialState,
        roundNumber: 1
      };

    default:
      return state;
  }
}

// Create context
const GameFlowContext = createContext();

// Provider component
export function GameFlowProvider({ children }) {
  // Initialize state from localStorage
  const getInitialState = () => {
    try {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        return { ...initialState, ...parsedState };
      }
    } catch (error) {
      console.warn('Failed to load game state from localStorage:', error);
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(gameFlowReducer, getInitialState());

  // Save state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('gameState', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save game state to localStorage:', error);
    }
  }, [state]);

  // Action creators
  const startGame = (players) => {
    dispatch({
      type: GAME_ACTIONS.START_GAME,
      payload: { players }
    });
  };

  const nextPhase = () => {
    dispatch({ type: GAME_ACTIONS.NEXT_PHASE });
  };

  const updateScores = (scores) => {
    dispatch({
      type: GAME_ACTIONS.UPDATE_SCORES,
      payload: { scores }
    });
  };

  const resetGame = () => {
    dispatch({ type: GAME_ACTIONS.RESET_GAME });
  };

  const value = {
    ...state,
    startGame,
    nextPhase,
    updateScores,
    resetGame
  };

  return (
    <GameFlowContext.Provider value={value}>
      {children}
    </GameFlowContext.Provider>
  );
}

// Custom hook
export function useGameFlow() {
  const context = useContext(GameFlowContext);
  if (!context) {
    throw new Error('useGameFlow must be used within a GameFlowProvider');
  }
  return context;
}

export { GameFlowContext };