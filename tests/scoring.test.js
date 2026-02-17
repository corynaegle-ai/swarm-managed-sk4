const { calculateScore, validateBid, applyBonus } = require('../scoring');

describe('Scoring Engine', () => {
  describe('calculateScore', () => {
    describe('Correct bid scenarios', () => {
      test('should calculate correct score for exact bid match', () => {
        const result = calculateScore({
          bid: 5,
          tricksWon: 5,
          round: 1
        });
        expect(result.score).toBe(15); // 10 base + 5 bid points
        expect(result.success).toBe(true);
      });

      test('should handle zero bid success', () => {
        const result = calculateScore({
          bid: 0,
          tricksWon: 0,
          round: 1
        });
        expect(result.score).toBe(10); // Base score for zero bid success
        expect(result.success).toBe(true);
      });

      test('should calculate score for high bid values', () => {
        const result = calculateScore({
          bid: 10,
          tricksWon: 10,
          round: 1
        });
        expect(result.score).toBe(30); // 10 base + 20 bid points
        expect(result.success).toBe(true);
      });

      test('should handle single trick bid success', () => {
        const result = calculateScore({
          bid: 1,
          tricksWon: 1,
          round: 1
        });
        expect(result.score).toBe(11); // 10 base + 1 bid point
        expect(result.success).toBe(true);
      });
    });

    describe('Incorrect bid scenarios', () => {
      test('should penalize overbidding', () => {
        const result = calculateScore({
          bid: 5,
          tricksWon: 3,
          round: 1
        });
        expect(result.score).toBeLessThan(0);
        expect(result.success).toBe(false);
      });

      test('should penalize underbidding', () => {
        const result = calculateScore({
          bid: 3,
          tricksWon: 5,
          round: 1
        });
        expect(result.score).toBeLessThan(0);
        expect(result.success).toBe(false);
      });

      test('should handle zero bid failure', () => {
        const result = calculateScore({
          bid: 0,
          tricksWon: 1,
          round: 1
        });
        expect(result.score).toBeLessThan(0);
        expect(result.success).toBe(false);
      });

      test('should handle large bid-trick differences', () => {
        const result = calculateScore({
          bid: 10,
          tricksWon: 0,
          round: 1
        });
        expect(result.score).toBeLessThan(-20);
        expect(result.success).toBe(false);
      });
    });

    describe('Bonus point application', () => {
      test('should apply round multiplier bonus', () => {
        const result = calculateScore({
          bid: 3,
          tricksWon: 3,
          round: 5
        });
        expect(result.score).toBeGreaterThan(13); // Base would be 13, bonus should increase
        expect(result.success).toBe(true);
      });

      test('should apply consecutive success bonus', () => {
        const result = calculateScore({
          bid: 2,
          tricksWon: 2,
          round: 1,
          consecutiveSuccesses: 3
        });
        expect(result.score).toBeGreaterThan(12); // Base would be 12, bonus should increase
        expect(result.success).toBe(true);
      });

      test('should apply perfect game bonus', () => {
        const result = calculateScore({
          bid: 5,
          tricksWon: 5,
          round: 1,
          perfectRound: true
        });
        expect(result.score).toBeGreaterThan(15); // Base would be 15, bonus should increase
        expect(result.success).toBe(true);
      });

      test('should combine multiple bonuses', () => {
        const result = calculateScore({
          bid: 3,
          tricksWon: 3,
          round: 8,
          consecutiveSuccesses: 2,
          perfectRound: true
        });
        expect(result.score).toBeGreaterThan(13); // Multiple bonuses should stack
        expect(result.success).toBe(true);
      });
    });

    describe('Edge cases and boundary conditions', () => {
      test('should handle minimum values', () => {
        const result = calculateScore({
          bid: 0,
          tricksWon: 0,
          round: 1
        });
        expect(result).toBeDefined();
        expect(typeof result.score).toBe('number');
        expect(typeof result.success).toBe('boolean');
      });

      test('should handle maximum reasonable values', () => {
        const result = calculateScore({
          bid: 13,
          tricksWon: 13,
          round: 10
        });
        expect(result).toBeDefined();
        expect(result.score).toBeGreaterThan(0);
      });

      test('should handle round 1 (minimum round)', () => {
        const result = calculateScore({
          bid: 1,
          tricksWon: 1,
          round: 1
        });
        expect(result.success).toBe(true);
        expect(result.score).toBe(11);
      });

      test('should handle maximum round number', () => {
        const result = calculateScore({
          bid: 1,
          tricksWon: 1,
          round: 10
        });
        expect(result.success).toBe(true);
        expect(result.score).toBeGreaterThan(11); // Should have round bonus
      });
    });

    describe('Error handling and invalid inputs', () => {
      test('should throw error for negative bid', () => {
        expect(() => {
          calculateScore({
            bid: -1,
            tricksWon: 1,
            round: 1
          });
        }).toThrow('Invalid bid: must be non-negative');
      });

      test('should throw error for negative tricks won', () => {
        expect(() => {
          calculateScore({
            bid: 1,
            tricksWon: -1,
            round: 1
          });
        }).toThrow('Invalid tricks won: must be non-negative');
      });

      test('should throw error for invalid round number', () => {
        expect(() => {
          calculateScore({
            bid: 1,
            tricksWon: 1,
            round: 0
          });
        }).toThrow('Invalid round: must be positive');
      });

      test('should throw error for non-integer bid', () => {
        expect(() => {
          calculateScore({
            bid: 1.5,
            tricksWon: 1,
            round: 1
          });
        }).toThrow('Bid must be an integer');
      });

      test('should throw error for non-integer tricks won', () => {
        expect(() => {
          calculateScore({
            bid: 1,
            tricksWon: 1.5,
            round: 1
          });
        }).toThrow('Tricks won must be an integer');
      });

      test('should throw error for missing required parameters', () => {
        expect(() => {
          calculateScore({});
        }).toThrow('Missing required parameters');
      });

      test('should throw error for null input', () => {
        expect(() => {
          calculateScore(null);
        }).toThrow('Invalid input: parameters object is required');
      });

      test('should throw error for undefined input', () => {
        expect(() => {
          calculateScore(undefined);
        }).toThrow('Invalid input: parameters object is required');
      });

      test('should throw error for non-object input', () => {
        expect(() => {
          calculateScore('invalid');
        }).toThrow('Invalid input: parameters must be an object');
      });
    });
  });

  describe('validateBid', () => {
    test('should validate correct bid format', () => {
      expect(validateBid(5)).toBe(true);
      expect(validateBid(0)).toBe(true);
      expect(validateBid(13)).toBe(true);
    });

    test('should reject negative bids', () => {
      expect(validateBid(-1)).toBe(false);
      expect(validateBid(-10)).toBe(false);
    });

    test('should reject non-integer bids', () => {
      expect(validateBid(1.5)).toBe(false);
      expect(validateBid(2.1)).toBe(false);
    });

    test('should reject non-numeric bids', () => {
      expect(validateBid('5')).toBe(false);
      expect(validateBid(null)).toBe(false);
      expect(validateBid(undefined)).toBe(false);
      expect(validateBid({})).toBe(false);
    });

    test('should reject excessively high bids', () => {
      expect(validateBid(100)).toBe(false);
      expect(validateBid(50)).toBe(false);
    });
  });

  describe('applyBonus', () => {
    test('should apply round multiplier bonus correctly', () => {
      const baseScore = 10;
      const bonus = applyBonus(baseScore, { round: 5 });
      expect(bonus).toBeGreaterThan(baseScore);
    });

    test('should apply consecutive success bonus', () => {
      const baseScore = 15;
      const bonus = applyBonus(baseScore, { consecutiveSuccesses: 3 });
      expect(bonus).toBeGreaterThan(baseScore);
    });

    test('should apply perfect round bonus', () => {
      const baseScore = 20;
      const bonus = applyBonus(baseScore, { perfectRound: true });
      expect(bonus).toBeGreaterThan(baseScore);
    });

    test('should not apply bonus with no qualifying conditions', () => {
      const baseScore = 12;
      const bonus = applyBonus(baseScore, {});
      expect(bonus).toBe(baseScore);
    });

    test('should handle zero base score', () => {
      const baseScore = 0;
      const bonus = applyBonus(baseScore, { round: 3 });
      expect(bonus).toBeGreaterThanOrEqual(0);
    });

    test('should handle negative base score', () => {
      const baseScore = -10;
      const bonus = applyBonus(baseScore, { round: 3 });
      expect(typeof bonus).toBe('number');
    });
  });

  describe('Integration tests', () => {
    test('should handle complete game scenario', () => {
      const rounds = [
        { bid: 1, tricksWon: 1, round: 1 },
        { bid: 2, tricksWon: 2, round: 2 },
        { bid: 0, tricksWon: 0, round: 3 },
        { bid: 3, tricksWon: 2, round: 4 }
      ];
      
      const results = rounds.map(round => calculateScore(round));
      
      expect(results).toHaveLength(4);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(results[2].success).toBe(true);
      expect(results[3].success).toBe(false);
      
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      expect(typeof totalScore).toBe('number');
    });

    test('should maintain score calculation consistency', () => {
      const testCase = { bid: 3, tricksWon: 3, round: 1 };
      
      const result1 = calculateScore(testCase);
      const result2 = calculateScore(testCase);
      
      expect(result1.score).toBe(result2.score);
      expect(result1.success).toBe(result2.success);
    });

    test('should handle stress test with multiple calculations', () => {
      const iterations = 100;
      const testCase = { bid: 5, tricksWon: 5, round: 1 };
      
      for (let i = 0; i < iterations; i++) {
        const result = calculateScore(testCase);
        expect(result.score).toBe(15);
        expect(result.success).toBe(true);
      }
    });
  });
});