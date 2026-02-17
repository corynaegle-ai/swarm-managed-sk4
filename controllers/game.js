const { calculateScore } = require('../utils/scoring');

/**
 * Game Controller - Manages game state and scoring
 */
class GameController {
  constructor() {
    this.gameState = {
      players: [],
      currentRound: 1,
      scores: {},
      gameStarted: false,
      gameEnded: false
    };
  }

  /**
   * Initialize a new game
   * @param {Array} players - Array of player objects
   */
  initializeGame(players) {
    this.gameState.players = players;
    this.gameState.scores = {};
    players.forEach(player => {
      this.gameState.scores[player.id] = 0;
    });
    this.gameState.gameStarted = true;
    this.gameState.gameEnded = false;
    this.gameState.currentRound = 1;
  }

  /**
   * Calculate and update scores for a round
   * @param {Object} roundData - Data for score calculation
   * @returns {Promise<Object>} Updated scores and game state
   */
  async calculateRoundScore(roundData) {
    try {
      if (!this.gameState.gameStarted) {
        throw new Error('Game not started');
      }

      // Use the new scoring engine to calculate scores
      const calculatedScores = await calculateScore(roundData);
      
      // Update game state with calculated scores
      Object.keys(calculatedScores).forEach(playerId => {
        if (this.gameState.scores[playerId] !== undefined) {
          this.gameState.scores[playerId] += calculatedScores[playerId];
        }
      });

      // Advance round
      this.gameState.currentRound++;

      return {
        success: true,
        roundScores: calculatedScores,
        totalScores: { ...this.gameState.scores },
        currentRound: this.gameState.currentRound,
        gameState: { ...this.gameState }
      };
    } catch (error) {
      console.error('Score calculation failed:', error.message);
      return {
        success: false,
        error: error.message,
        gameState: { ...this.gameState }
      };
    }
  }

  /**
   * Get current game state
   * @returns {Object} Current game state
   */
  getGameState() {
    return { ...this.gameState };
  }

  /**
   * End the current game
   */
  endGame() {
    this.gameState.gameEnded = true;
    return {
      success: true,
      finalScores: { ...this.gameState.scores },
      gameState: { ...this.gameState }
    };
  }

  /**
   * Reset game state
   */
  resetGame() {
    this.gameState = {
      players: [],
      currentRound: 1,
      scores: {},
      gameStarted: false,
      gameEnded: false
    };
  }
}

module.exports = GameController;