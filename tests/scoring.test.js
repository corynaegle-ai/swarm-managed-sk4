const { calculateScore } = require('../src/scoring');

describe('Scoring Engine Tests', () => {
  describe('Basic Scoring Rules', () => {
    test('correct bid scores points equal to bid amount', () => {
      const result = calculateScore(5, 5);
      expect(result.points).toBe(5);
      expect(result.success).toBe(true);
    });

    test('incorrect bid scores zero points', () => {
      const result = calculateScore(5, 3);
      expect(result.points).toBe(0);
      expect(result.success).toBe(false);
    });

    test('multiple correct bids accumulate points', () => {
      let totalPoints = 0;
      const bid1 = calculateScore(3, 3);
      const bid2 = calculateScore(2, 2);
      totalPoints = bid1.points + bid2.points;
      expect(totalPoints).toBe(5);
    });
  });

  describe('Zero Bid Scenarios', () => {
    test('zero bid with zero tricks succeeds and scores 10 bonus points', () => {
      const result = calculateScore(0, 0);
      expect(result.points).toBe(10);
      expect(result.success).toBe(true);
      expect(result.bonus).toBe(true);
    });

    test('zero bid with non-zero tricks fails and scores zero points', () => {
      const result = calculateScore(0, 1);
      expect(result.points).toBe(0);
      expect(result.success).toBe(false);
      expect(result.bonus).toBe(false);
    });

    test('zero bid with multiple tricks fails', () => {
      const result = calculateScore(0, 3);
      expect(result.points).toBe(0);
      expect(result.success).toBe(false);
    });
  });

  describe('Bonus Point Application', () => {
    test('successful zero bid applies 10 bonus points', () => {
      const result = calculateScore(0, 0);
      expect(result.points).toBe(10);
      expect(result.bonus).toBe(true);
    });

    test('non-zero successful bids do not receive bonus points', () => {
      const result = calculateScore(3, 3);
      expect(result.points).toBe(3);
      expect(result.bonus).toBe(false);
    });

    test('failed bids do not receive bonus points', () => {
      const result = calculateScore(3, 2);
      expect(result.points).toBe(0);
      expect(result.bonus).toBe(false);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('maximum reasonable bid value', () => {
      const result = calculateScore(13, 13);
      expect(result.points).toBe(13);
      expect(result.success).toBe(true);
    });

    test('single trick bid success', () => {
      const result = calculateScore(1, 1);
      expect(result.points).toBe(1);
      expect(result.success).toBe(true);
    });

    test('single trick bid failure', () => {
      const result = calculateScore(1, 0);
      expect(result.points).toBe(0);
      expect(result.success).toBe(false);
    });

    test('large bid difference', () => {
      const result = calculateScore(10, 2);
      expect(result.points).toBe(0);
      expect(result.success).toBe(false);
    });
  });

  describe('Invalid Input Handling', () => {
    test('negative bid throws error', () => {
      expect(() => calculateScore(-1, 2)).toThrow('Invalid bid: must be non-negative integer');
    });

    test('negative tricks throws error', () => {
      expect(() => calculateScore(2, -1)).toThrow('Invalid tricks: must be non-negative integer');
    });

    test('non-integer bid throws error', () => {
      expect(() => calculateScore(2.5, 2)).toThrow('Invalid bid: must be non-negative integer');
    });

    test('non-integer tricks throws error', () => {
      expect(() => calculateScore(2, 2.5)).toThrow('Invalid tricks: must be non-negative integer');
    });

    test('null bid throws error', () => {
      expect(() => calculateScore(null, 2)).toThrow('Invalid bid: must be non-negative integer');
    });

    test('undefined tricks throws error', () => {
      expect(() => calculateScore(2, undefined)).toThrow('Invalid tricks: must be non-negative integer');
    });

    test('string bid throws error', () => {
      expect(() => calculateScore('2', 2)).toThrow('Invalid bid: must be non-negative integer');
    });

    test('boolean tricks throws error', () => {
      expect(() => calculateScore(2, true)).toThrow('Invalid tricks: must be non-negative integer');
    });

    test('NaN bid throws error', () => {
      expect(() => calculateScore(NaN, 2)).toThrow('Invalid bid: must be non-negative integer');
    });

    test('Infinity tricks throws error', () => {
      expect(() => calculateScore(2, Infinity)).toThrow('Invalid tricks: must be non-negative integer');
    });
  });

  describe('Comprehensive Scoring Scenarios', () => {
    test('sequence of mixed successful and failed bids', () => {
      const results = [
        calculateScore(3, 3),  // 3 points
        calculateScore(2, 1),  // 0 points
        calculateScore(0, 0),  // 10 points
        calculateScore(1, 2),  // 0 points
        calculateScore(4, 4)   // 4 points
      ];
      
      const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
      expect(totalPoints).toBe(17);
      
      const successCount = results.filter(r => r.success).length;
      expect(successCount).toBe(3);
    });

    test('all zero bids scenario', () => {
      const results = [
        calculateScore(0, 0),  // 10 points
        calculateScore(0, 0),  // 10 points
        calculateScore(0, 1)   // 0 points
      ];
      
      const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
      expect(totalPoints).toBe(20);
    });

    test('progressive bid increases', () => {
      const bids = [1, 2, 3, 4, 5];
      const tricks = [1, 2, 3, 4, 5];
      const results = bids.map((bid, index) => calculateScore(bid, tricks[index]));
      
      const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
      expect(totalPoints).toBe(15);
      expect(results.every(r => r.success)).toBe(true);
    });
  });

  describe('Return Value Structure', () => {
    test('successful bid returns correct structure', () => {
      const result = calculateScore(3, 3);
      expect(result).toHaveProperty('points');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('bonus');
      expect(typeof result.points).toBe('number');
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.bonus).toBe('boolean');
    });

    test('failed bid returns correct structure', () => {
      const result = calculateScore(3, 2);
      expect(result).toHaveProperty('points');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('bonus');
      expect(result.points).toBe(0);
      expect(result.success).toBe(false);
      expect(result.bonus).toBe(false);
    });

    test('bonus bid returns correct structure', () => {
      const result = calculateScore(0, 0);
      expect(result).toHaveProperty('points');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('bonus');
      expect(result.points).toBe(10);
      expect(result.success).toBe(true);
      expect(result.bonus).toBe(true);
    });
  });
});