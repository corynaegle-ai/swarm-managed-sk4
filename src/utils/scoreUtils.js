/**
 * Score calculation utilities for managing game scores and rounds
 */

/**
 * Calculate cumulative scores from round data
 * @param {Array} rounds - Array of round objects with player scores
 * @returns {Object} Object with player names as keys and cumulative scores as values
 */
export const calculateCumulativeScores = (rounds = []) => {
  if (!Array.isArray(rounds)) {
    console.warn('calculateCumulativeScores: rounds must be an array');
    return {};
  }

  const cumulativeScores = {};
  
  rounds.forEach((round, roundIndex) => {
    if (!round || typeof round !== 'object') {
      console.warn(`calculateCumulativeScores: Invalid round at index ${roundIndex}`);
      return;
    }

    // Handle both direct score properties and nested scores object
    const scores = round.scores || round;
    
    Object.entries(scores).forEach(([player, score]) => {
      // Skip non-numeric scores and metadata fields
      if (typeof score !== 'number' || isNaN(score)) {
        return;
      }
      
      if (!cumulativeScores[player]) {
        cumulativeScores[player] = 0;
      }
      cumulativeScores[player] += score;
    });
  });
  
  return cumulativeScores;
};

/**
 * Determine the current round number
 * @param {Array} rounds - Array of round objects
 * @param {boolean} includeIncomplete - Whether to count incomplete rounds
 * @returns {number} Current round number (1-indexed)
 */
export const getCurrentRound = (rounds = [], includeIncomplete = false) => {
  if (!Array.isArray(rounds)) {
    console.warn('getCurrentRound: rounds must be an array');
    return 1;
  }

  if (rounds.length === 0) {
    return 1;
  }

  if (includeIncomplete) {
    return rounds.length + 1;
  }

  // Count only complete rounds
  const completeRounds = rounds.filter(round => {
    if (!round || typeof round !== 'object') {
      return false;
    }
    
    const scores = round.scores || round;
    const playerScores = Object.entries(scores).filter(([key, value]) => 
      typeof value === 'number' && !isNaN(value)
    );
    
    // Consider a round complete if it has at least one valid score
    return playerScores.length > 0;
  });
  
  return completeRounds.length + 1;
};

/**
 * Check if a round is complete (all expected players have scores)
 * @param {Object} round - Round object
 * @param {Array} expectedPlayers - Array of expected player names
 * @returns {boolean} True if round is complete
 */
export const isRoundComplete = (round, expectedPlayers = []) => {
  if (!round || typeof round !== 'object') {
    return false;
  }

  if (expectedPlayers.length === 0) {
    // If no expected players specified, check if round has any valid scores
    const scores = round.scores || round;
    const validScores = Object.entries(scores).filter(([key, value]) => 
      typeof value === 'number' && !isNaN(value)
    );
    return validScores.length > 0;
  }

  const scores = round.scores || round;
  return expectedPlayers.every(player => 
    scores.hasOwnProperty(player) && 
    typeof scores[player] === 'number' && 
    !isNaN(scores[player])
  );
};

/**
 * Format score data for table display
 * @param {Array} rounds - Array of round objects
 * @param {Array} players - Array of player names
 * @returns {Object} Formatted data with rounds, totals, and metadata
 */
export const formatScoreDataForTable = (rounds = [], players = []) => {
  if (!Array.isArray(rounds) || !Array.isArray(players)) {
    console.warn('formatScoreDataForTable: rounds and players must be arrays');
    return {
      rounds: [],
      totals: {},
      players: [],
      currentRound: 1,
      completedRounds: 0
    };
  }

  const cumulativeScores = calculateCumulativeScores(rounds);
  const currentRound = getCurrentRound(rounds);
  const completedRounds = rounds.filter(round => isRoundComplete(round, players)).length;
  
  // Format rounds for table display
  const formattedRounds = rounds.map((round, index) => {
    const scores = round.scores || round;
    const formattedRound = {
      round: index + 1,
      scores: {},
      isComplete: isRoundComplete(round, players)
    };
    
    players.forEach(player => {
      formattedRound.scores[player] = scores[player] || null;
    });
    
    return formattedRound;
  });
  
  // Ensure all players have totals (even if 0)
  const totals = {};
  players.forEach(player => {
    totals[player] = cumulativeScores[player] || 0;
  });
  
  return {
    rounds: formattedRounds,
    totals,
    players,
    currentRound,
    completedRounds,
    hasIncompleteRound: rounds.some(round => !isRoundComplete(round, players))
  };
};

/**
 * Get player rankings based on cumulative scores
 * @param {Object} cumulativeScores - Object with player scores
 * @param {boolean} ascending - Whether to rank in ascending order (default: false for descending)
 * @returns {Array} Array of player objects with rank, name, and score
 */
export const getPlayerRankings = (cumulativeScores = {}, ascending = false) => {
  if (!cumulativeScores || typeof cumulativeScores !== 'object') {
    console.warn('getPlayerRankings: cumulativeScores must be an object');
    return [];
  }

  const players = Object.entries(cumulativeScores)
    .filter(([player, score]) => typeof score === 'number' && !isNaN(score))
    .map(([player, score]) => ({ name: player, score }))
    .sort((a, b) => ascending ? a.score - b.score : b.score - a.score);
  
  return players.map((player, index) => ({
    ...player,
    rank: index + 1
  }));
};

/**
 * Calculate round statistics
 * @param {Array} rounds - Array of round objects
 * @returns {Object} Statistics about the rounds
 */
export const calculateRoundStatistics = (rounds = []) => {
  if (!Array.isArray(rounds)) {
    return {
      totalRounds: 0,
      completedRounds: 0,
      averageScore: 0,
      highestScore: null,
      lowestScore: null
    };
  }

  const allScores = [];
  let completedCount = 0;
  
  rounds.forEach(round => {
    if (!round || typeof round !== 'object') return;
    
    const scores = round.scores || round;
    const validScores = Object.values(scores).filter(score => 
      typeof score === 'number' && !isNaN(score)
    );
    
    if (validScores.length > 0) {
      completedCount++;
      allScores.push(...validScores);
    }
  });
  
  const averageScore = allScores.length > 0 
    ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length 
    : 0;
  
  return {
    totalRounds: rounds.length,
    completedRounds: completedCount,
    averageScore: Math.round(averageScore * 100) / 100,
    highestScore: allScores.length > 0 ? Math.max(...allScores) : null,
    lowestScore: allScores.length > 0 ? Math.min(...allScores) : null
  };
};