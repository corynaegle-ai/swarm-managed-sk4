const request = require('supertest');
const express = require('express');
const gameRoutes = require('../routes/game');
const GameFlowManager = require('../services/GameFlowManager');

jest.mock('../services/GameFlowManager');

const app = express();
app.use(express.json());
app.use('/api/game', gameRoutes);

describe('Game Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/game/status', () => {
    it('should return current game status', async () => {
      const mockState = { phase: 'setup', round: 1 };
      GameFlowManager.getCurrentState.mockResolvedValue(mockState);

      const response = await request(app)
        .get('/api/game/status')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.phase).toBe('setup');
      expect(response.body.data.round).toBe(1);
    });
  });

  describe('POST /api/game/advance', () => {
    it('should advance game phase when valid', async () => {
      const currentState = { phase: 'setup', round: 1 };
      const newState = { phase: 'playing', round: 1 };
      
      GameFlowManager.getCurrentState.mockResolvedValue(currentState);
      GameFlowManager.canAdvancePhase.mockResolvedValue(true);
      GameFlowManager.advancePhase.mockResolvedValue(newState);

      const response = await request(app)
        .post('/api/game/advance')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.currentPhase).toBe('playing');
    });

    it('should return 400 for invalid transitions', async () => {
      const currentState = { phase: 'ended', round: 1 };
      
      GameFlowManager.getCurrentState.mockResolvedValue(currentState);
      GameFlowManager.canAdvancePhase.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/game/advance')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid phase transition');
    });
  });

  describe('POST /api/game/reset', () => {
    it('should reset game to initial state', async () => {
      const newState = { phase: 'setup', round: 1 };
      GameFlowManager.resetGame.mockResolvedValue(newState);

      const response = await request(app)
        .post('/api/game/reset')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.phase).toBe('setup');
      expect(response.body.data.round).toBe(1);
    });
  });
});