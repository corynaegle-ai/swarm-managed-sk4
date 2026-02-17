/**
 * Scoring utilities for Spades game
 * Handles score calculations, bonus points, and validation
 */

/**
 * Calculate score for a player based on bid vs tricks taken
 * @param {number} bid - Number of tricks bid
 * @param {number} tricks - Number of tricks actually taken
 * @param {number} bags - Current bag count for the player
 * @returns {Object} Score calculation result
 */
export function calculateRoundScore(bid, tricks, bags = 0) {
  // Validate inputs
  if (typeof bid !== 'number' || typeof tricks !== 'number' || bid < 0 || tricks < 0) {
    throw new Error('Invalid bid or tricks value');
  }

  let points = 0;
  let newBags = bags;
  let bonus = 0;
  let penalty = 0;

  if (bid === 0) {
    // Nil bid
    if (tricks === 0) {
      points = 100; // Successful nil
      bonus = 100;
    } else {
      points = -100; // Failed nil
      penalty = 100;
      newBags += tricks; // Overtricks become bags
    }
  } else {
    // Regular bid
    if (tricks >= bid) {
      // Made bid
      points = bid * 10;
      const overtricks = tricks - bid;
      points += overtricks; // Each overtrick = 1 point
      newBags += overtricks;
      
      if (overtricks > 0) {
        bonus = overtricks;
      }
    } else {
      // Failed bid
      points = -(bid * 10);
      penalty = bid * 10;
    }
  }

  // Check for bag penalty (every 10 bags = -100 points)
  const bagPenalty = Math.floor(newBags / 10) - Math.floor(bags / 10);
  if (bagPenalty > 0) {
    points -= bagPenalty * 100;
    penalty += bagPenalty * 100;
  }

  return {
    points,
    bags: newBags,
    bonus,
    penalty,
    madeContract: bid === 0 ? tricks === 0 : tricks >= bid
  };
}

/**
 * Calculate team score from individual player scores
 * @param {Object} player1Score - First player's score calculation
 * @param {Object} player2Score - Second player's score calculation
 * @returns {Object} Team score result
 */
export function calculateTeamScore(player1Score, player2Score) {
  return {
    points: player1Score.points + player2Score.points,
    bags: player1Score.bags + player2Score.bags,
    bonus: player1Score.bonus + player2Score.bonus,
    penalty: player1Score.penalty + player2Score.penalty
  };
}

/**
 * Validate that all score entries are complete for a round
 * @param {Array} players - Array of player objects with bid and tricks properties
 * @returns {Object} Validation result
 */
export function validateScoreEntries(players) {
  if (!Array.isArray(players) || players.length === 0) {
    return {
      isValid: false,
      errors: ['No players provided'],
      missingEntries: []
    };
  }

  const errors = [];
  const missingEntries = [];

  players.forEach((player, index) => {
    const playerName = player.name || `Player ${index + 1}`;
    
    // Check if bid is valid
    if (typeof player.bid !== 'number' || player.bid < 0) {
      errors.push(`${playerName}: Invalid or missing bid`);
      missingEntries.push({ player: playerName, field: 'bid' });
    }
    
    // Check if tricks is valid
    if (typeof player.tricks !== 'number' || player.tricks < 0) {
      errors.push(`${playerName}: Invalid or missing tricks taken`);
      missingEntries.push({ player: playerName, field: 'tricks' });
    }
    
    // Validate tricks doesn't exceed maximum possible (13)
    if (typeof player.tricks === 'number' && player.tricks > 13) {
      errors.push(`${playerName}: Tricks taken cannot exceed 13`);
      missingEntries.push({ player: playerName, field: 'tricks' });
    }
  });

  // Check that total tricks equal 13
  const totalTricks = players.reduce((sum, player) => {
    return sum + (typeof player.tricks === 'number' ? player.tricks : 0);
  }, 0);

  if (errors.length === 0 && totalTricks !== 13) {
    errors.push('Total tricks must equal 13');
  }

  return {
    isValid: errors.length === 0,
    errors,
    missingEntries,
    totalTricks
  };
}

/**
 * Check if all required score entries are complete
 * @param {Array} players - Array of player objects
 * @returns {boolean} True if all entries are complete
 */
export function areScoreEntriesComplete(players) {
  const validation = validateScoreEntries(players);
  return validation.isValid;
}

/**
 * Get incomplete entries for UI indication
 * @param {Array} players - Array of player objects
 * @returns {Array} Array of incomplete entry objects
 */
export function getIncompleteEntries(players) {
  const validation = validateScoreEntries(players);
  return validation.missingEntries;
}

/**
 * Calculate bonus points breakdown for display
 * @param {number} bid - Number of tricks bid
 * @param {number} tricks - Number of tricks taken
 * @returns {Object} Bonus breakdown
 */
export function getBonusBreakdown(bid, tricks) {
  const breakdown = {
    overtricks: 0,
    nilBonus: 0,
    total: 0
  };

  if (bid === 0 && tricks === 0) {
    // Successful nil
    breakdown.nilBonus = 100;
    breakdown.total = 100;
  } else if (bid > 0 && tricks > bid) {
    // Overtricks
    breakdown.overtricks = tricks - bid;
    breakdown.total = breakdown.overtricks;
  }

  return breakdown;
}

/**
 * Format score for display with appropriate signs and colors
 * @param {number} score - Score value
 * @param {boolean} hasBonus - Whether score includes bonus
 * @returns {Object} Formatted score object
 */
export function formatScoreDisplay(score, hasBonus = false) {
  return {
    value: score,
    display: score > 0 ? `+${score}` : score.toString(),
    isPositive: score > 0,
    isNegative: score < 0,
    hasBonus,
    className: hasBonus ? 'score-bonus' : score > 0 ? 'score-positive' : score < 0 ? 'score-negative' : 'score-neutral'
  };
}