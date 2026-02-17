import React, { createContext, useContext, useReducer } from 'react';

// Game phases
export const GAME_PHASES = {
  SETUP: 'setup',
  BIDDING: 'bidding',
  PLAYING: 'playing',
  SCORING: 'scoring',
  RESULTS: 'results',
  GAME_OVER: 'gameOver'
};

// Initial state
const initialState = {
  currentPhase: GAME_PHASES.SETUP,
  players: [],
  currentRound: 1,
  scores: {},
  gameSettings: {
    maxRounds: 10,
    targetScore: 500
  }
};

// Action types
export const GAME_ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  ADD_PLAYER: 'ADD_PLAYER',
  REMOVE_PLAYER: 'REMOVE_PLAYER',
  UPDATE_SCORES: 'UPDATE_SCORES',
  NEXT_ROUND: 'NEXT_ROUND',
  RESET_GAME: 'RESET_GAME'
};

// Reducer function
function gameFlowReducer(state, action) {
  switch (action.type) {
    case GAME_ACTIONS.SET_PHASE:
      return {
        ...state,
        currentPhase: action.payload
      };
    case GAME_ACTIONS.ADD_PLAYER:
      return {
        ...state,
        players: [...state.players, action.payload],
        scores: {
          ...state.scores,
          [action.payload.id]: 0
        }
      };
    case GAME_ACTIONS.REMOVE_PLAYER:
      const newPlayers = state.players.filter(p => p.id !== action.payload);
      const newScores = { ...state.scores };
      delete newScores[action.payload];
      return {
        ...state,
        players: newPlayers,
        scores: newScores
      };
    case GAME_ACTIONS.UPDATE_SCORES:
      return {
        ...state,
        scores: {
          ...state.scores,
          ...action.payload
        }
      };
    case GAME_ACTIONS.NEXT_ROUND:
      return {
        ...state,
        currentRound: state.currentRound + 1
      };
    case GAME_ACTIONS.RESET_GAME:
      return initialState;
    default:
      return state;
  }
}

// Create context
const GameFlowContext = createContext();

// Provider component
export function GameFlowProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameFlowReducer, initialState);

  const value = {
    gameState,
    dispatch
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

export default GameFlowContext;