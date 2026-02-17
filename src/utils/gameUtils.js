/**
 * Game utility functions for bid validation and game flow management
 */

/**
 * Game phases enum
 */
export const GAME_PHASES = {
  DEALING: 'dealing',
  BIDDING: 'bidding',
  PLAYING: 'playing',
  SCORING: 'scoring'
};

/**
 * Validates a bid for a given hand count
 * @param {number} bid - The bid to validate
 * @param {number} handCount - Number of cards in the hand
 * @returns {boolean} - True if bid is valid, false otherwise
 */
export function isValidBid(bid, handCount) {
  if (typeof bid !== 'number' || !Number.isInteger(bid)) {
    return false;
  }
  return bid >= 0 && bid <= handCount;
}

/**
 * Validates a bid and throws an error if invalid
 * @param {number} bid - The bid to validate
 * @param {number} handCount - Number of cards in the hand
 * @throws {Error} - If bid is invalid
 */
export function validateBid(bid, handCount) {
  if (typeof bid !== 'number' || !Number.isInteger(bid)) {
    throw new Error(`Invalid bid type: expected integer, got ${typeof bid}`);
  }
  if (bid < 0) {
    throw new Error(`Invalid bid: ${bid}. Bid cannot be negative`);
  }
  if (bid > handCount) {
    throw new Error(`Invalid bid: ${bid}. Bid cannot exceed hand count of ${handCount}`);
  }
}

/**
 * Checks if all players have submitted valid bids
 * @param {Array} players - Array of player objects
 * @param {number} handCount - Number of cards in each hand
 * @returns {boolean} - True if all players have valid bids
 */
export function allPlayersHaveBids(players, handCount) {
  if (!Array.isArray(players) || players.length === 0) {
    return false;
  }
  
  return players.every(player => {
    return player.bid !== undefined && 
           player.bid !== null && 
           isValidBid(player.bid, handCount);
  });
}

/**
 * Updates game state to transition between phases
 * @param {Object} gameState - Current game state
 * @param {string} newPhase - New phase to transition to
 * @returns {Object} - Updated game state
 */
export function updateGamePhase(gameState, newPhase) {
  if (!Object.values(GAME_PHASES).includes(newPhase)) {
    throw new Error(`Invalid game phase: ${newPhase}`);
  }
  
  return {
    ...gameState,
    phase: newPhase,
    lastPhaseChange: new Date().toISOString()
  };
}

/**
 * Processes bid collection and transitions to playing phase if all bids are in
 * @param {Object} gameState - Current game state
 * @returns {Object} - Updated game state
 */
export function processBidCollection(gameState) {
  if (!gameState.players || !Array.isArray(gameState.players)) {
    throw new Error('Invalid game state: players array is required');
  }
  
  const handCount = gameState.handCount || 0;
  
  // Validate all existing bids
  gameState.players.forEach((player, index) => {
    if (player.bid !== undefined && player.bid !== null) {
      try {
        validateBid(player.bid, handCount);
      } catch (error) {
        throw new Error(`Invalid bid for player ${index}: ${error.message}`);
      }
    }
  });
  
  const updatedState = { ...gameState };
  
  // If all players have valid bids and we're in bidding phase, move to playing
  if (gameState.phase === GAME_PHASES.BIDDING && 
      allPlayersHaveBids(gameState.players, handCount)) {
    updatedState.phase = GAME_PHASES.PLAYING;
    updatedState.lastPhaseChange = new Date().toISOString();
    updatedState.biddingComplete = true;
  }
  
  return updatedState;
}

/**
 * Gets the count of players who have submitted bids
 * @param {Array} players - Array of player objects
 * @returns {number} - Count of players with bids
 */
export function getBidCount(players) {
  if (!Array.isArray(players)) {
    return 0;
  }
  
  return players.filter(player => 
    player.bid !== undefined && player.bid !== null
  ).length;
}

/**
 * Checks if the game can transition from bidding to playing phase
 * @param {Object} gameState - Current game state
 * @returns {boolean} - True if transition is allowed
 */
export function canTransitionToPlaying(gameState) {
  return gameState.phase === GAME_PHASES.BIDDING &&
         gameState.players &&
         allPlayersHaveBids(gameState.players, gameState.handCount || 0);
}