const GameController = require('../controllers/game');
const { calculateScore } = require('../utils/scoring');

// Mock the scoring module
jest.mock('../utils/scoring');

describe('GameController', () => {
  let gameController;
  
  beforeEach(() => {
    gameController = new GameController();
    jest.clearAllMocks();
  });

  describe('initializeGame', () => {
    it('should initialize game with players', () => {
      const players = [{ id: 'player1' }, { id: 'player2' }];
      gameController.initializeGame(players);
      
      const gameState = gameController.getGameState();
      expect(gameState.players).toEqual(players);
      expect(gameState.gameStarted).toBe(true);
      expect(gameState.scores).toEqual({ player1: 0, player2: 0 });
    });
  });

  describe('calculateRoundScore', () => {
    beforeEach(() => {
      const players = [{ id: 'player1' }, { id: 'player2' }];
      gameController.initializeGame(players);
    });

    it('should use scoring engine and update game state', async () => {
      const mockScores = { player1: 10, player2: 15 };
      calculateScore.mockResolvedValue(mockScores);
      
      const roundData = { round: 1, actions: [] };
      const result = await gameController.calculateRoundScore(roundData);
      
      expect(calculateScore).toHaveBeenCalledWith(roundData);
      expect(result.success).toBe(true);
      expect(result.roundScores).toEqual(mockScores);
      expect(result.totalScores).toEqual({ player1: 10, player2: 15 });
    });

    it('should handle scoring engine errors', async () => {
      calculateScore.mockRejectedValue(new Error('Scoring failed'));
      
      const roundData = { round: 1, actions: [] };
      const result = await gameController.calculateRoundScore(roundData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Scoring failed');
    });

    it('should throw error if game not started', async () => {
      gameController.resetGame();
      
      const roundData = { round: 1, actions: [] };
      const result = await gameController.calculateRoundScore(roundData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Game not started');
    });
  });
});