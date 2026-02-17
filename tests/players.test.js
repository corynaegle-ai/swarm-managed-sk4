const request = require('supertest');
const express = require('express');
const playersRouter = require('../routes/players');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/api/games', playersRouter);

// Clean up test data
const testDataFile = path.join(__dirname, '..', 'data', 'games.json');

beforeEach(() => {
  if (fs.existsSync(testDataFile)) {
    fs.unlinkSync(testDataFile);
  }
});

aftereAll(() => {
  if (fs.existsSync(testDataFile)) {
    fs.unlinkSync(testDataFile);
  }
});

describe('Player Management API', () => {
  const gameId = 'test-game-123';
  
  describe('POST /api/games/:gameId/players', () => {
    test('should create a player with unique ID and validate name uniqueness', async () => {
      const response = await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'John Doe' })
        .expect(201);
      
      expect(response.body.player).toHaveProperty('id');
      expect(response.body.player.name).toBe('John Doe');
      expect(response.body.player).toHaveProperty('joinedAt');
      
      // Test name uniqueness
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'John Doe' })
        .expect(400);
    });
    
    test('should validate player name is required', async () => {
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({})
        .expect(400);
    });
    
    test('should enforce 8 player maximum', async () => {
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
    test('should update player name with validation', async () => {
      // Create player
      const createResponse = await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Original Name' })
        .expect(201);
      
      const playerId = createResponse.body.player.id;
      
      // Update name
      const updateResponse = await request(app)
        .put(`/api/games/${gameId}/players/${playerId}`)
        .send({ name: 'Updated Name' })
        .expect(200);
      
      expect(updateResponse.body.player.name).toBe('Updated Name');
      expect(updateResponse.body.player).toHaveProperty('updatedAt');
    });
    
    test('should validate name uniqueness on update', async () => {
      // Create two players
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Player1' })
        .expect(201);
      
      const player2Response = await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Player2' })
        .expect(201);
      
      const player2Id = player2Response.body.player.id;
      
      // Try to update player2 to have same name as player1
      await request(app)
        .put(`/api/games/${gameId}/players/${player2Id}`)
        .send({ name: 'Player1' })
        .expect(400);
    });
  });
  
  describe('DELETE /api/games/:gameId/players/:playerId', () => {
    test('should remove player and validate minimum count', async () => {
      // Create 3 players
      const players = [];
      for (let i = 1; i <= 3; i++) {
        const response = await request(app)
          .post(`/api/games/${gameId}/players`)
          .send({ name: `Player${i}` })
          .expect(201);
        players.push(response.body.player);
      }
      
      // Remove one player (should succeed)
      await request(app)
        .delete(`/api/games/${gameId}/players/${players[0].id}`)
        .expect(200);
      
      // Try to remove another (should fail - would leave only 1 player)
      await request(app)
        .delete(`/api/games/${gameId}/players/${players[1].id}`)
        .expect(400);
    });
  });
  
  describe('GET /api/games/:gameId/players', () => {
    test('should return all players for a game', async () => {
      // Create 2 players
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Player1' })
        .expect(201);
      
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Player2' })
        .expect(201);
      
      // Get all players
      const response = await request(app)
        .get(`/api/games/${gameId}/players`)
        .expect(200);
      
      expect(response.body.players).toHaveLength(2);
      expect(response.body.count).toBe(2);
      expect(response.body).toHaveProperty('gameStarted');
    });
  });
  
  describe('Game start validation', () => {
    test('should validate 2-8 player limit before game start', async () => {
      // Try to start with 0 players
      await request(app)
        .post(`/api/games/${gameId}/start`)
        .expect(400);
      
      // Add 1 player
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Player1' })
        .expect(201);
      
      // Try to start with 1 player (should fail)
      await request(app)
        .post(`/api/games/${gameId}/start`)
        .expect(400);
      
      // Add another player
      await request(app)
        .post(`/api/games/${gameId}/players`)
        .send({ name: 'Player2' })
        .expect(201);
      
      // Should now be able to start
      await request(app)
        .post(`/api/games/${gameId}/start`)
        .expect(200);
    });
  });
});