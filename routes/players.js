const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// In-memory storage for MVP (can be replaced with database later)
let games = {};

// Simple file-based persistence for MVP
const dataFile = path.join(__dirname, '..', 'data', 'games.json');

// Load existing data on startup
function loadGames() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8');
      games = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading games data:', error);
    games = {};
  }
}

// Save games data to file
function saveGames() {
  try {
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify(games, null, 2));
  } catch (error) {
    console.error('Error saving games data:', error);
  }
}

// Load games on module initialization
loadGames();

// Validation middleware
function validateGameExists(req, res, next) {
  const { gameId } = req.params;
  if (!games[gameId]) {
    games[gameId] = { players: [], started: false };
    saveGames();
  }
  next();
}

function validatePlayerName(req, res, next) {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Player name is required and must be a non-empty string' });
  }
  if (name.trim().length > 50) {
    return res.status(400).json({ error: 'Player name must be 50 characters or less' });
  }
  req.body.name = name.trim();
  next();
}

function validatePlayerExists(req, res, next) {
  const { gameId, playerId } = req.params;
  const game = games[gameId];
  const player = game.players.find(p => p.id === playerId);
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  req.player = player;
  next();
}

// GET /api/games/:gameId/players - List all players in a game
router.get('/:gameId/players', validateGameExists, (req, res) => {
  const { gameId } = req.params;
  const game = games[gameId];
  
  res.json({
    players: game.players,
    count: game.players.length,
    gameStarted: game.started
  });
});

// POST /api/games/:gameId/players - Add a player to a game
router.post('/:gameId/players', validateGameExists, validatePlayerName, (req, res) => {
  const { gameId } = req.params;
  const { name } = req.body;
  const game = games[gameId];
  
  // Check if game has already started
  if (game.started) {
    return res.status(400).json({ error: 'Cannot add players to a game that has already started' });
  }
  
  // Check player limit (max 8 players)
  if (game.players.length >= 8) {
    return res.status(400).json({ error: 'Maximum of 8 players allowed per game' });
  }
  
  // Check for unique name
  const existingPlayer = game.players.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (existingPlayer) {
    return res.status(400).json({ error: 'Player name must be unique within the game' });
  }
  
  // Create new player
  const newPlayer = {
    id: uuidv4(),
    name: name,
    joinedAt: new Date().toISOString()
  };
  
  game.players.push(newPlayer);
  saveGames();
  
  res.status(201).json({
    player: newPlayer,
    message: 'Player added successfully'
  });
});

// PUT /api/games/:gameId/players/:playerId - Update player name
router.put('/:gameId/players/:playerId', validateGameExists, validatePlayerExists, validatePlayerName, (req, res) => {
  const { gameId } = req.params;
  const { name } = req.body;
  const game = games[gameId];
  const player = req.player;
  
  // Check if game has already started
  if (game.started) {
    return res.status(400).json({ error: 'Cannot modify players in a game that has already started' });
  }
  
  // Check for unique name (excluding current player)
  const existingPlayer = game.players.find(p => p.id !== player.id && p.name.toLowerCase() === name.toLowerCase());
  if (existingPlayer) {
    return res.status(400).json({ error: 'Player name must be unique within the game' });
  }
  
  // Update player name
  player.name = name;
  player.updatedAt = new Date().toISOString();
  saveGames();
  
  res.json({
    player: player,
    message: 'Player name updated successfully'
  });
});

// DELETE /api/games/:gameId/players/:playerId - Remove a player from a game
router.delete('/:gameId/players/:playerId', validateGameExists, validatePlayerExists, (req, res) => {
  const { gameId, playerId } = req.params;
  const game = games[gameId];
  
  // Check if game has already started
  if (game.started) {
    return res.status(400).json({ error: 'Cannot remove players from a game that has already started' });
  }
  
  // Check minimum player count (must have at least 2 players to start a game)
  // Only enforce this if there are currently 2 or fewer players
  if (game.players.length <= 2 && game.players.length > 1) {
    return res.status(400).json({ 
      error: 'Cannot remove player - minimum of 2 players required for game',
      currentCount: game.players.length
    });
  }
  
  // Remove player
  const playerIndex = game.players.findIndex(p => p.id === playerId);
  const removedPlayer = game.players.splice(playerIndex, 1)[0];
  saveGames();
  
  res.json({
    removedPlayer: removedPlayer,
    remainingCount: game.players.length,
    message: 'Player removed successfully'
  });
});

// Helper endpoint to start a game (validates 2-8 player requirement)
router.post('/:gameId/start', validateGameExists, (req, res) => {
  const { gameId } = req.params;
  const game = games[gameId];
  
  if (game.started) {
    return res.status(400).json({ error: 'Game has already started' });
  }
  
  // Validate 2-8 player requirement
  if (game.players.length < 2) {
    return res.status(400).json({ 
      error: 'Minimum of 2 players required to start game',
      currentCount: game.players.length
    });
  }
  
  if (game.players.length > 8) {
    return res.status(400).json({ 
      error: 'Maximum of 8 players allowed per game',
      currentCount: game.players.length
    });
  }
  
  game.started = true;
  game.startedAt = new Date().toISOString();
  saveGames();
  
  res.json({
    message: 'Game started successfully',
    playerCount: game.players.length,
    players: game.players
  });
});

module.exports = router;