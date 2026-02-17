const { GameFlowManager, PHASES } = require('../src/services/GameFlowManager');

describe('GameFlowManager', () => {
  let gameFlow;

  beforeEach(() => {
    gameFlow = new GameFlowManager();
  });

  describe('Initial State', () => {
    test('should start in SETUP phase', () => {
      expect(gameFlow.getCurrentPhase()).toBe(PHASES.SETUP);
    });

    test('should start at round 1', () => {
      expect(gameFlow.getCurrentRound()).toBe(1);
    });

    test('should not be complete initially', () => {
      expect(gameFlow.isGameComplete()).toBe(false);
    });
  });

  describe('Phase Validation', () => {
    test('should allow SETUP to BIDDING transition', () => {
      expect(gameFlow.validatePhaseTransition(PHASES.SETUP, PHASES.BIDDING)).toBe(true);
    });

    test('should allow BIDDING to SCORING transition', () => {
      expect(gameFlow.validatePhaseTransition(PHASES.BIDDING, PHASES.SCORING)).toBe(true);
    });

    test('should allow SCORING to BIDDING transition', () => {
      expect(gameFlow.validatePhaseTransition(PHASES.SCORING, PHASES.BIDDING)).toBe(true);
    });

    test('should prevent invalid transitions', () => {
      expect(gameFlow.validatePhaseTransition(PHASES.SETUP, PHASES.SCORING)).toBe(false);
      expect(gameFlow.validatePhaseTransition(PHASES.BIDDING, PHASES.SETUP)).toBe(false);
      expect(gameFlow.validatePhaseTransition(PHASES.SCORING, PHASES.SETUP)).toBe(false);
    });

    test('should prevent transitions with invalid phases', () => {
      expect(gameFlow.validatePhaseTransition('INVALID', PHASES.BIDDING)).toBe(false);
      expect(gameFlow.validatePhaseTransition(PHASES.SETUP, 'INVALID')).toBe(false);
    });
  });

  describe('Phase Transitions', () => {
    test('should successfully transition from SETUP to BIDDING', () => {
      expect(gameFlow.transitionToPhase(PHASES.BIDDING)).toBe(true);
      expect(gameFlow.getCurrentPhase()).toBe(PHASES.BIDDING);
    });

    test('should throw error for invalid transitions', () => {
      expect(() => {
        gameFlow.transitionToPhase(PHASES.SCORING);
      }).toThrow('Invalid phase transition');
    });

    test('should emit phase change events', () => {
      const eventCallback = jest.fn();
      gameFlow.addEventListener('phaseChanged', eventCallback);
      
      gameFlow.transitionToPhase(PHASES.BIDDING);
      
      expect(eventCallback).toHaveBeenCalledWith({
        previousPhase: PHASES.SETUP,
        newPhase: PHASES.BIDDING,
        round: 1
      });
    });
  });

  describe('Round Advancement', () => {
    beforeEach(() => {
      // Set up to scoring phase
      gameFlow.transitionToPhase(PHASES.BIDDING);
      gameFlow.transitionToPhase(PHASES.SCORING);
    });

    test('should advance round from scoring phase', () => {
      gameFlow.advanceToNextRound();
      expect(gameFlow.getCurrentRound()).toBe(2);
      expect(gameFlow.getCurrentPhase()).toBe(PHASES.BIDDING);
    });

    test('should throw error when not in scoring phase', () => {
      gameFlow.transitionToPhase(PHASES.BIDDING);
      expect(() => {
        gameFlow.advanceToNextRound();
      }).toThrow('Can only advance rounds after scoring phase is complete');
    });

    test('should emit round advanced event', () => {
      const eventCallback = jest.fn();
      gameFlow.addEventListener('roundAdvanced', eventCallback);
      
      gameFlow.advanceToNextRound();
      
      expect(eventCallback).toHaveBeenCalledWith({
        newRound: 2,
        phase: PHASES.BIDDING
      });
    });
  });

  describe('Game Completion', () => {
    test('should not be complete before round 10', () => {
      expect(gameFlow.isGameComplete()).toBe(false);
    });

    test('should be complete after round 10', () => {
      // Advance to round 11
      gameFlow.currentRound = 11;
      expect(gameFlow.isGameComplete()).toBe(true);
    });

    test('should emit game completed event after final round', () => {
      const eventCallback = jest.fn();
      gameFlow.addEventListener('gameCompleted', eventCallback);
      
      // Set to round 10 and advance
      gameFlow.currentRound = 10;
      gameFlow.transitionToPhase(PHASES.BIDDING);
      gameFlow.transitionToPhase(PHASES.SCORING);
      gameFlow.advanceToNextRound();
      
      expect(eventCallback).toHaveBeenCalledWith({
        finalRound: 11
      });
    });

    test('should prevent advancing beyond game completion', () => {
      gameFlow.currentRound = 11;
      expect(() => {
        gameFlow.advanceToNextRound();
      }).toThrow('Cannot advance round - game is already complete');
    });
  });

  describe('Game State', () => {
    test('should return complete game state', () => {
      const state = gameFlow.getGameState();
      expect(state).toEqual({
        phase: PHASES.SETUP,
        round: 1,
        isComplete: false,
        maxRounds: 10
      });
    });
  });

  describe('Game Reset', () => {
    test('should reset game to initial state', () => {
      // Advance game state
      gameFlow.transitionToPhase(PHASES.BIDDING);
      gameFlow.transitionToPhase(PHASES.SCORING);
      gameFlow.advanceToNextRound();
      
      // Reset
      gameFlow.resetGame();
      
      expect(gameFlow.getCurrentPhase()).toBe(PHASES.SETUP);
      expect(gameFlow.getCurrentRound()).toBe(1);
      expect(gameFlow.isGameComplete()).toBe(false);
    });

    test('should emit game reset event', () => {
      const eventCallback = jest.fn();
      gameFlow.addEventListener('gameReset', eventCallback);
      
      gameFlow.resetGame();
      
      expect(eventCallback).toHaveBeenCalledWith({
        phase: PHASES.SETUP,
        round: 1
      });
    });
  });
});