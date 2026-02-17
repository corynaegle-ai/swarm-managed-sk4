const request = require('supertest');
const express = require('express');
const playersRouter = require('../routes/players');

const app = express();
app.use(express.json());
app.use('/api/games', playersRouter);

describe('Player Management API', () => {
  const gameId = 'test-game-123';
  
  beforeEach(() => {
    // Clear any existing game data before each test
    delete require.cache[require.resolve('../routes/players')];
  });
  
  describe('POST /api/games/:gameId/players', () => {
    it('should create a player with unique ID', async () => {
      const response = await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'John Doe' })
        .expect(201);
      
      expect(response.body.player).toHaveProperty('id');
      expect(response.body.player).toHaveProperty('name', 'John Doe');
      expect(response.body.player).toHaveProperty('createdAt');
    });
    
    it('should validate name uniqueness', async () => {
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'John Doe' })
        .expect(201);
      
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'John Doe' })
        .expect(400);
    });
    
    it('should enforce maximum 8 players', async () => {
      // Add 8 players
      for (let i = 1; i <= 8; i++) {
        await request(app)
          .post(`/api/games/${gameId}/players`)
          .send({ name: `Player${i}` })
          .expect(201);
      }
      
      // 9th player should fail
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Player9' })
        .expect(400);
    });
  });
  
  describe('PUT /api/games/:gameId/players/:playerId', () => {
    it('should update player name with validation', async () => {
      const createResponse = await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'John Doe' })
        .expect(201);
      
      const playerId = createResponse.body.player.id;
      
      const updateResponse = await request(app)
        .put(`/api/games/${gameId}/players/${playerId}`)
        .send({ name: 'Jane Doe' })
        .expect(200);
      
      expect(updateResponse.body.player.name).toBe('Jane Doe');
    });
  });
  
  describe('DELETE /api/games/:gameId/players/:playerId', () => {
    it('should remove player', async () => {
      const createResponse = await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'John Doe' })
        .expect(201);
      
      const playerId = createResponse.body.player.id;
      
      await request(app)
        .delete(`/api/games/${gameId}/players/${playerId}`)
        .expect(200);
      
      const listResponse = await request(app)
        .get(`/api/games/${gameId}/players`)
        .expect(200);
      
      expect(listResponse.body.totalPlayers).toBe(0);
    });
  });
  
  describe('GET /api/games/:gameId/players', () => {
    it('should return all players for a game', async () => {
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Player1' })
        .expect(201);
      
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Player2' })
        .expect(201);
      
      const response = await request(app)
        .get(`/api/games/${gameId}/players`)
        .expect(200);
      
      expect(response.body.totalPlayers).toBe(2);
      expect(response.body.players).toHaveLength(2);
      expect(response.body.canStart).toBe(true);
    });
  });
  
  describe('Game start validation (2-8 players)', () => {
    it('should validate minimum 2 players before start', async () => {
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Player1' })
        .expect(201);
      
      await request(app)
        .post(`/api/games/${gameId}/start`)
        .expect(400);
      
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Player2' })
        .expect(201);
      
      await request(app)
        .post(`/api/games/${gameId}/start`)
        .expect(200);
    });
  });
});