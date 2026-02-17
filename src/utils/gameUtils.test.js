import {
  isValidBid,
  validateBid,
  allPlayersHaveBids,
  updateGamePhase,
  processBidCollection,
  getBidCount,
  canTransitionToPlaying,
  GAME_PHASES
} from './gameUtils.js';

describe('gameUtils', () => {
  describe('isValidBid', () => {
    it('should return true for valid bids', () => {
      expect(isValidBid(0, 5)).toBe(true);
      expect(isValidBid(3, 5)).toBe(true);
      expect(isValidBid(5, 5)).toBe(true);
    });

    it('should return false for invalid bids', () => {
      expect(isValidBid(-1, 5)).toBe(false);
      expect(isValidBid(6, 5)).toBe(false);
      expect(isValidBid('3', 5)).toBe(false);
      expect(isValidBid(3.5, 5)).toBe(false);
    });
  });

  describe('validateBid', () => {
    it('should not throw for valid bids', () => {
      expect(() => validateBid(0, 5)).not.toThrow();
      expect(() => validateBid(5, 5)).not.toThrow();
    });

    it('should throw for invalid bids', () => {
      expect(() => validateBid(-1, 5)).toThrow('cannot be negative');
      expect(() => validateBid(6, 5)).toThrow('cannot exceed hand count');
      expect(() => validateBid('3', 5)).toThrow('expected integer');
    });
  });

  describe('allPlayersHaveBids', () => {
    it('should return true when all players have valid bids', () => {
      const players = [
        { name: 'Player1', bid: 2 },
        { name: 'Player2', bid: 0 },
        { name: 'Player3', bid: 3 }
      ];
      expect(allPlayersHaveBids(players, 5)).toBe(true);
    });

    it('should return false when some players missing bids', () => {
      const players = [
        { name: 'Player1', bid: 2 },
        { name: 'Player2' },
        { name: 'Player3', bid: 3 }
      ];
      expect(allPlayersHaveBids(players, 5)).toBe(false);
    });

    it('should return false for invalid bids', () => {
      const players = [
        { name: 'Player1', bid: 2 },
        { name: 'Player2', bid: 6 }
      ];
      expect(allPlayersHaveBids(players, 5)).toBe(false);
    });
  });

  describe('processBidCollection', () => {
    it('should transition to playing when all bids are valid', () => {
      const gameState = {
        phase: GAME_PHASES.BIDDING,
        handCount: 5,
        players: [
          { name: 'Player1', bid: 2 },
          { name: 'Player2', bid: 3 }
        ]
      };
      
      const result = processBidCollection(gameState);
      expect(result.phase).toBe(GAME_PHASES.PLAYING);
      expect(result.biddingComplete).toBe(true);
    });

    it('should throw error for invalid bids', () => {
      const gameState = {
        phase: GAME_PHASES.BIDDING,
        handCount: 5,
        players: [
          { name: 'Player1', bid: 6 }
        ]
      };
      
      expect(() => processBidCollection(gameState)).toThrow('Invalid bid for player');
    });
  });
});