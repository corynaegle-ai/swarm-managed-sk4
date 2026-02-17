const express = require('express');
const router = express.Router();
const GameFlowManager = require('../services/GameFlowManager');

// Middleware for error handling
const handleAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// GET /api/game/status - Return current phase and round
router.get('/status', handleAsync(async (req, res) => {
  try {
    const gameState = await GameFlowManager.getCurrentState();
    
    res.json({
      success: true,
      data: {
        phase: gameState.phase,
        round: gameState.round,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve game status',
      message: error.message
    });
  }
}));

// POST /api/game/advance - Move to next phase with validation
router.post('/advance', handleAsync(async (req, res) => {
  try {
    const currentState = await GameFlowManager.getCurrentState();
    const canAdvance = await GameFlowManager.canAdvancePhase(currentState.phase);
    
    if (!canAdvance) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phase transition',
        message: `Cannot advance from phase: ${currentState.phase}`
      });
    }
    
    const newState = await GameFlowManager.advancePhase();
    
    res.json({
      success: true,
      data: {
        previousPhase: currentState.phase,
        currentPhase: newState.phase,
        round: newState.round,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    if (error.message.includes('Invalid') || error.message.includes('transition')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phase transition',
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to advance game phase',
      message: error.message
    });
  }
}));

// POST /api/game/reset - Initialize new game state
router.post('/reset', handleAsync(async (req, res) => {
  try {
    const newGameState = await GameFlowManager.resetGame();
    
    res.json({
      success: true,
      data: {
        phase: newGameState.phase,
        round: newGameState.round,
        message: 'Game successfully reset',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to reset game',
      message: error.message
    });
  }
}));

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Game route error:', error);
  
  if (res.headersSent) {
    return next(error);
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

module.exports = router;