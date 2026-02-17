import {
  calculateRoundScore,
  calculateTeamScore,
  validateScoreEntries,
  areScoreEntriesComplete,
  getIncompleteEntries,
  getBonusBreakdown,
  formatScoreDisplay
} from './scoring.js';

describe('Scoring Utils', () => {
  describe('calculateRoundScore', () => {
    test('calculates successful regular bid', () => {
      const result = calculateRoundScore(4, 4, 0);
      expect(result.points).toBe(40);
      expect(result.bags).toBe(0);
      expect(result.bonus).toBe(0);
      expect(result.madeContract).toBe(true);
    });

    test('calculates successful bid with overtricks', () => {
      const result = calculateRoundScore(4, 6, 2);
      expect(result.points).toBe(42); // 40 + 2 overtricks
      expect(result.bags).toBe(4); // 2 existing + 2 new
      expect(result.bonus).toBe(2);
      expect(result.madeContract).toBe(true);
    });

    test('calculates failed bid', () => {
      const result = calculateRoundScore(5, 3, 0);
      expect(result.points).toBe(-50);
      expect(result.bags).toBe(0);
      expect(result.penalty).toBe(50);
      expect(result.madeContract).toBe(false);
    });

    test('calculates successful nil bid', () => {
      const result = calculateRoundScore(0, 0, 0);
      expect(result.points).toBe(100);
      expect(result.bags).toBe(0);
      expect(result.bonus).toBe(100);
      expect(result.madeContract).toBe(true);
    });

    test('calculates failed nil bid', () => {
      const result = calculateRoundScore(0, 2, 0);
      expect(result.points).toBe(-100);
      expect(result.bags).toBe(2);
      expect(result.penalty).toBe(100);
      expect(result.madeContract).toBe(false);
    });

    test('applies bag penalty', () => {
      const result = calculateRoundScore(3, 5, 8); // 8 + 2 = 10 bags
      expect(result.points).toBe(32 - 100); // 30 + 2 - 100 bag penalty
      expect(result.bags).toBe(10);
      expect(result.penalty).toBe(100);
    });
  });

  describe('validateScoreEntries', () => {
    test('validates complete entries', () => {
      const players = [
        { name: 'Player 1', bid: 4, tricks: 5 },
        { name: 'Player 2', bid: 3, tricks: 3 },
        { name: 'Player 3', bid: 2, tricks: 2 },
        { name: 'Player 4', bid: 4, tricks: 3 }
      ];
      const result = validateScoreEntries(players);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('detects missing bids', () => {
      const players = [
        { name: 'Player 1', tricks: 5 },
        { name: 'Player 2', bid: 3, tricks: 3 }
      ];
      const result = validateScoreEntries(players);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Player 1: Invalid or missing bid');
    });

    test('detects invalid trick totals', () => {
      const players = [
        { name: 'Player 1', bid: 4, tricks: 5 },
        { name: 'Player 2', bid: 3, tricks: 3 },
        { name: 'Player 3', bid: 2, tricks: 2 },
        { name: 'Player 4', bid: 4, tricks: 4 } // Total = 14
      ];
      const result = validateScoreEntries(players);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Total tricks must equal 13');
    });
  });

  describe('getBonusBreakdown', () => {
    test('calculates nil bonus', () => {
      const breakdown = getBonusBreakdown(0, 0);
      expect(breakdown.nilBonus).toBe(100);
      expect(breakdown.total).toBe(100);
    });

    test('calculates overtrick bonus', () => {
      const breakdown = getBonusBreakdown(4, 6);
      expect(breakdown.overtricks).toBe(2);
      expect(breakdown.total).toBe(2);
    });
  });
});
