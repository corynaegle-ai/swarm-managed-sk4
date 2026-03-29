const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage for games and players
const games = new Map();

// Middleware for input validation
const validatePlayerName = (req, res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Player name is required and must be a non-empty string' });
  }
  if (name.trim().length > 50) {
    return res.status(400).json({ error: 'Player name must be 50 characters or less' });
  }
  req.body.name = name.trim();
  next();
};

const validateGameExists = (req, res, next) => {
  const { gameId } = req.params;
  if (!games.has(gameId)) {
    games.set(gameId, { players: [], gameStarted: false });
  }
  req.game = games.get(gameId);
  next();
};

const validatePlayerExists = (req, res, next) => {
  const { playerId } = req.params;
  const player = req.game.players.find(p => p.id === playerId);
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  req.player = player;
  next();
};

// POST /api/games/:gameId/players - Add player to game
router.post('/:gameId/players', validateGameExists, validatePlayerName, (req, res) => {
  try {
    const { name } = req.body;
    const game = req.game;
    
    // Check if game has started
    if (game.gameStarted) {
      return res.status(400).json({ error: 'Cannot add players to a game that has already started' });
    }
    
    // Check player limit (max 8 players)
    if (game.players.length >= 8) {
      return res.status(400).json({ error: 'Maximum of 8 players allowed per game' });
    }
    
    // Check for unique name
    const nameExists = game.players.some(player => 
      player.name.toLowerCase() === name.toLowerCase()
    );
    if (nameExists) {
      return res.status(400).json({ error: 'Player name must be unique within the game' });
    }
    
    // Create new player
    const newPlayer = {
      id: uuidv4(),
      name: name,
      createdAt: new Date().toISOString()
    };
    
    game.players.push(newPlayer);
    
    res.status(201).json({
      message: 'Player added successfully',
      player: newPlayer,
      totalPlayers: game.players.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/games/:gameId/players/:playerId - Edit player name
router.put('/:gameId/players/:playerId', validateGameExists, validatePlayerExists, validatePlayerName, (req, res) => {
  try {
    const { name } = req.body;
    const game = req.game;
    const player = req.player;
    
    // Check if game has started
    if (game.gameStarted) {
      return res.status(400).json({ error: 'Cannot edit players in a game that has already started' });
    }
    
    // Check for unique name (excluding current player)
    const nameExists = game.players.some(p => 
      p.id !== player.id && p.name.toLowerCase() === name.toLowerCase()
    );
    if (nameExists) {
      return res.status(400).json({ error: 'Player name must be unique within the game' });
    }
    
    // Update player name
    player.name = name;
    player.updatedAt = new Date().toISOString();
    
    res.json({
      message: 'Player name updated successfully',
      player: player
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/games/:gameId/players/:playerId - Remove player
router.delete('/:gameId/players/:playerId', validateGameExists, validatePlayerExists, (req, res) => {
  try {
    const game = req.game;
    const { playerId } = req.params;
    
    // Check if game has started
    if (game.gameStarted) {
      return res.status(400).json({ error: 'Cannot remove players from a game that has already started' });
    }
    
    // Check minimum player count (need at least 1 to remove, leaving minimum 0 for pre-game)
    // Note: The actual minimum of 2 players is enforced when starting the game
    game.players = game.players.filter(player => player.id !== playerId);
    
    res.json({
      message: 'Player removed successfully',
      totalPlayers: game.players.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/games/:gameId/players - List all players in game
router.get('/:gameId/players', validateGameExists, (req, res) => {
  try {
    const game = req.game;
    
    res.json({
      gameId: req.params.gameId,
      players: game.players,
      totalPlayers: game.players.length,
      gameStarted: game.gameStarted,
      canStart: game.players.length >= 2 && game.players.length <= 8
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Additional helper endpoint to start a game (validates 2-8 player requirement)
router.post('/:gameId/start', validateGameExists, (req, res) => {
  try {
    const game = req.game;
    
    if (game.gameStarted) {
      return res.status(400).json({ error: 'Game has already started' });
    }
    
    if (game.players.length < 2) {
      return res.status(400).json({ 
        error: 'Minimum of 2 players required to start the game',
        currentPlayers: game.players.length
      });
    }
    
    if (game.players.length > 8) {
      return res.status(400).json({ 
        error: 'Maximum of 8 players allowed to start the game',
        currentPlayers: game.players.length
      });
    }
    
    game.gameStarted = true;
    game.startedAt = new Date().toISOString();
    
    res.json({
      message: 'Game started successfully',
      gameId: req.params.gameId,
      players: game.players,
      startedAt: game.startedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;