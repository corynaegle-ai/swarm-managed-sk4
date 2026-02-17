import { useState, useCallback, useMemo } from 'react';
import {
  calculateCumulativeScores,
  getCurrentRound,
  formatScoreDataForTable,
  getPlayerRankings,
  calculateRoundStatistics,
  isRoundComplete
} from '../utils/scoreUtils';

/**
 * Custom hook for managing game state and providing computed values
 * @param {Object} initialState - Initial game state
 * @returns {Object} Game state and management functions
 */
export const useGameState = (initialState = {}) => {
  const [gameState, setGameState] = useState({
    players: [],
    rounds: [],
    gameSettings: {},
    ...initialState
  });

  // Computed values using useMemo for performance
  const computedValues = useMemo(() => {
    const { players, rounds } = gameState;
    
    try {
      const cumulativeScores = calculateCumulativeScores(rounds);
      const currentRound = getCurrentRound(rounds);
      const formattedData = formatScoreDataForTable(rounds, players);
      const rankings = getPlayerRankings(cumulativeScores);
      const statistics = calculateRoundStatistics(rounds);
      
      return {
        cumulativeScores,
        currentRound,
        formattedData,
        rankings,
        statistics,
        hasIncompleteRounds: rounds.some(round => !isRoundComplete(round, players)),
        isGameStarted: rounds.length > 0,
        totalPlayers: players.length
      };
    } catch (error) {
      console.error('Error computing game values:', error);
      return {
        cumulativeScores: {},
        currentRound: 1,
        formattedData: { rounds: [], totals: {}, players: [] },
        rankings: [],
        statistics: {},
        hasIncompleteRounds: false,
        isGameStarted: false,
        totalPlayers: 0
      };
    }
  }, [gameState.players, gameState.rounds]);

  // Add a new player
  const addPlayer = useCallback((playerName) => {
    if (!playerName || typeof playerName !== 'string') {
      console.warn('addPlayer: playerName must be a non-empty string');
      return false;
    }
    
    setGameState(prevState => {
      if (prevState.players.includes(playerName)) {
        console.warn(`Player ${playerName} already exists`);
        return prevState;
      }
      
      return {
        ...prevState,
        players: [...prevState.players, playerName]
      };
    });
    
    return true;
  }, []);

  // Remove a player
  const removePlayer = useCallback((playerName) => {
    setGameState(prevState => ({
      ...prevState,
      players: prevState.players.filter(player => player !== playerName)
    }));
  }, []);

  // Add a new round
  const addRound = useCallback((roundScores = {}) => {
    if (typeof roundScores !== 'object' || roundScores === null) {
      console.warn('addRound: roundScores must be an object');
      return false;
    }
    
    setGameState(prevState => {
      const newRound = {
        round: prevState.rounds.length + 1,
        scores: { ...roundScores },
        timestamp: new Date().toISOString()
      };
      
      return {
        ...prevState,
        rounds: [...prevState.rounds, newRound]
      };
    });
    
    return true;
  }, []);

  // Update a specific round
  const updateRound = useCallback((roundIndex, roundScores) => {
    if (typeof roundIndex !== 'number' || roundIndex < 0) {
      console.warn('updateRound: roundIndex must be a non-negative number');
      return false;
    }
    
    if (typeof roundScores !== 'object' || roundScores === null) {
      console.warn('updateRound: roundScores must be an object');
      return false;
    }
    
    setGameState(prevState => {
      if (roundIndex >= prevState.rounds.length) {
        console.warn(`updateRound: roundIndex ${roundIndex} out of bounds`);
        return prevState;
      }
      
      const updatedRounds = [...prevState.rounds];
      updatedRounds[roundIndex] = {
        ...updatedRounds[roundIndex],
        scores: { ...roundScores },
        lastModified: new Date().toISOString()
      };
      
      return {
        ...prevState,
        rounds: updatedRounds
      };
    });
    
    return true;
  }, []);

  // Update score for a specific player in a specific round
  const updatePlayerScore = useCallback((roundIndex, playerName, score) => {
    if (typeof roundIndex !== 'number' || roundIndex < 0) {
      console.warn('updatePlayerScore: roundIndex must be a non-negative number');
      return false;
    }
    
    if (!playerName || typeof playerName !== 'string') {
      console.warn('updatePlayerScore: playerName must be a non-empty string');
      return false;
    }
    
    if (typeof score !== 'number' || isNaN(score)) {
      console.warn('updatePlayerScore: score must be a valid number');
      return false;
    }
    
    setGameState(prevState => {
      if (roundIndex >= prevState.rounds.length) {
        console.warn(`updatePlayerScore: roundIndex ${roundIndex} out of bounds`);
        return prevState;
      }
      
      const updatedRounds = [...prevState.rounds];
      const updatedRound = { ...updatedRounds[roundIndex] };
      updatedRound.scores = { ...updatedRound.scores, [playerName]: score };
      updatedRound.lastModified = new Date().toISOString();
      updatedRounds[roundIndex] = updatedRound;
      
      return {
        ...prevState,
        rounds: updatedRounds
      };
    });
    
    return true;
  }, []);

  // Reset the entire game
  const resetGame = useCallback(() => {
    setGameState({
      players: [],
      rounds: [],
      gameSettings: {},
      ...initialState
    });
  }, [initialState]);

  // Update game settings
  const updateGameSettings = useCallback((settings) => {
    if (typeof settings !== 'object' || settings === null) {
      console.warn('updateGameSettings: settings must be an object');
      return false;
    }
    
    setGameState(prevState => ({
      ...prevState,
      gameSettings: { ...prevState.gameSettings, ...settings }
    }));
    
    return true;
  }, []);

  // Get specific player's scores across all rounds
  const getPlayerHistory = useCallback((playerName) => {
    if (!playerName || typeof playerName !== 'string') {
      console.warn('getPlayerHistory: playerName must be a non-empty string');
      return [];
    }
    
    return gameState.rounds.map((round, index) => {
      const scores = round.scores || {};
      return {
        round: index + 1,
        score: scores[playerName] || null,
        timestamp: round.timestamp
      };
    }).filter(entry => entry.score !== null);
  }, [gameState.rounds]);

  return {
    // State
    gameState,
    setGameState,
    
    // Computed values
    ...computedValues,
    
    // Actions
    addPlayer,
    removePlayer,
    addRound,
    updateRound,
    updatePlayerScore,
    resetGame,
    updateGameSettings,
    
    // Queries
    getPlayerHistory
  };
};

export default useGameState;