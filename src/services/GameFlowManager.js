/**
 * Game Flow Manager Service
 * Manages game phases, rounds, and state transitions for SK4 game
 */

// Game phase enumeration
const PHASES = {
  SETUP: 'SETUP',
  BIDDING: 'BIDDING',
  SCORING: 'SCORING'
};

// Valid phase transitions
const VALID_TRANSITIONS = {
  [PHASES.SETUP]: [PHASES.BIDDING],
  [PHASES.BIDDING]: [PHASES.SCORING],
  [PHASES.SCORING]: [PHASES.BIDDING] // Can go back to bidding for next round
};

class GameFlowManager {
  constructor() {
    this.currentPhase = PHASES.SETUP;
    this.currentRound = 1;
    this.maxRounds = 10;
    this.eventListeners = new Map();
  }

  /**
   * Get current game phase
   * @returns {string} Current phase
   */
  getCurrentPhase() {
    return this.currentPhase;
  }

  /**
   * Get current round number
   * @returns {number} Current round (1-10)
   */
  getCurrentRound() {
    return this.currentRound;
  }

  /**
   * Validate if a phase transition is allowed
   * @param {string} fromPhase - Current phase
   * @param {string} toPhase - Target phase
   * @returns {boolean} True if transition is valid
   */
  validatePhaseTransition(fromPhase, toPhase) {
    if (!PHASES[fromPhase] || !PHASES[toPhase]) {
      return false;
    }

    const allowedTransitions = VALID_TRANSITIONS[fromPhase] || [];
    return allowedTransitions.includes(toPhase);
  }

  /**
   * Transition to a new phase
   * @param {string} newPhase - Target phase
   * @returns {boolean} True if transition successful
   */
  transitionToPhase(newPhase) {
    if (!this.validatePhaseTransition(this.currentPhase, newPhase)) {
      throw new Error(`Invalid phase transition from ${this.currentPhase} to ${newPhase}`);
    }

    const previousPhase = this.currentPhase;
    this.currentPhase = newPhase;

    // Emit phase change event
    this.emitEvent('phaseChanged', {
      previousPhase,
      newPhase,
      round: this.currentRound
    });

    return true;
  }

  /**
   * Advance to next round after scoring is complete
   * @returns {boolean} True if advancement successful
   */
  advanceToNextRound() {
    if (this.currentPhase !== PHASES.SCORING) {
      throw new Error('Can only advance rounds after scoring phase is complete');
    }

    if (this.isGameComplete()) {
      throw new Error('Cannot advance round - game is already complete');
    }

    this.currentRound++;
    
    // If game is not complete, transition back to bidding for next round
    if (!this.isGameComplete()) {
      this.currentPhase = PHASES.BIDDING;
      
      // Emit round advance event
      this.emitEvent('roundAdvanced', {
        newRound: this.currentRound,
        phase: this.currentPhase
      });
    } else {
      // Game complete after round 10
      this.emitEvent('gameCompleted', {
        finalRound: this.currentRound
      });
    }

    return true;
  }

  /**
   * Check if game is complete (after round 10)
   * @returns {boolean} True if game is complete
   */
  isGameComplete() {
    return this.currentRound > this.maxRounds;
  }

  /**
   * Reset game to initial state
   */
  resetGame() {
    this.currentPhase = PHASES.SETUP;
    this.currentRound = 1;
    
    this.emitEvent('gameReset', {
      phase: this.currentPhase,
      round: this.currentRound
    });
  }

  /**
   * Add event listener
   * @param {string} eventType - Type of event
   * @param {Function} callback - Callback function
   */
  addEventListener(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} eventType - Type of event
   * @param {Function} callback - Callback function to remove
   */
  removeEventListener(eventType, callback) {
    if (this.eventListeners.has(eventType)) {
      const callbacks = this.eventListeners.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to all registered listeners
   * @param {string} eventType - Type of event
   * @param {Object} eventData - Event data
   */
  emitEvent(eventType, eventData) {
    if (this.eventListeners.has(eventType)) {
      this.eventListeners.get(eventType).forEach(callback => {
        try {
          callback(eventData);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Get game state summary
   * @returns {Object} Current game state
   */
  getGameState() {
    return {
      phase: this.currentPhase,
      round: this.currentRound,
      isComplete: this.isGameComplete(),
      maxRounds: this.maxRounds
    };
  }
}

// Export both the class and the PHASES enum
module.exports = {
  GameFlowManager,
  PHASES
};