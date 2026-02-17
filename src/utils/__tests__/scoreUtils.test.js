import {
  calculateCumulativeScores,
  getCurrentRound,
  formatScoreDataForTable,
  getPlayerRankings,
  calculateRoundStatistics,
  isRoundComplete
} from '../scoreUtils';

describe('scoreUtils', () => {
  describe('calculateCumulativeScores', () => {
    it('should calculate cumulative scores correctly', () => {
      const rounds = [
        { alice: 10, bob: 15 },
        { alice: 20, bob: 10 },
        { alice: 5, bob: 25 }
      ];
      const result = calculateCumulativeScores(rounds);
      expect(result).toEqual({ alice: 35, bob: 50 });
    });

    it('should handle empty rounds array', () => {
      const result = calculateCumulativeScores([]);
      expect(result).toEqual({});
    });

    it('should handle invalid input gracefully', () => {
      const result = calculateCumulativeScores(null);
      expect(result).toEqual({});
    });

    it('should skip invalid scores', () => {
      const rounds = [
        { alice: 10, bob: 'invalid' },
        { alice: 20, bob: null }
      ];
      const result = calculateCumulativeScores(rounds);
      expect(result).toEqual({ alice: 30 });
    });
  });

  describe('getCurrentRound', () => {
    it('should return correct current round number', () => {
      const rounds = [
        { alice: 10, bob: 15 },
        { alice: 20, bob: 10 }
      ];
      const result = getCurrentRound(rounds);
      expect(result).toBe(3);
    });

    it('should return 1 for empty rounds', () => {
      const result = getCurrentRound([]);
      expect(result).toBe(1);
    });

    it('should handle includeIncomplete parameter', () => {
      const rounds = [{ alice: 10 }];
      const result = getCurrentRound(rounds, true);
      expect(result).toBe(2);
    });
  });

  describe('formatScoreDataForTable', () => {
    it('should format score data correctly', () => {
      const rounds = [
        { alice: 10, bob: 15 },
        { alice: 20, bob: 10 }
      ];
      const players = ['alice', 'bob'];
      const result = formatScoreDataForTable(rounds, players);
      
      expect(result.totals).toEqual({ alice: 30, bob: 25 });
      expect(result.currentRound).toBe(3);
      expect(result.players).toEqual(['alice', 'bob']);
      expect(result.rounds).toHaveLength(2);
    });

    it('should handle empty inputs', () => {
      const result = formatScoreDataForTable([], []);
      expect(result.rounds).toEqual([]);
      expect(result.totals).toEqual({});
      expect(result.currentRound).toBe(1);
    });
  });

  describe('isRoundComplete', () => {
    it('should detect complete rounds', () => {
      const round = { alice: 10, bob: 15 };
      const players = ['alice', 'bob'];
      const result = isRoundComplete(round, players);
      expect(result).toBe(true);
    });

    it('should detect incomplete rounds', () => {
      const round = { alice: 10 };
      const players = ['alice', 'bob'];
      const result = isRoundComplete(round, players);
      expect(result).toBe(false);
    });

    it('should handle no expected players', () => {
      const round = { alice: 10 };
      const result = isRoundComplete(round, []);
      expect(result).toBe(true);
    });
  });

  describe('getPlayerRankings', () => {
    it('should rank players correctly', () => {
      const scores = { alice: 30, bob: 50, charlie: 20 };
      const result = getPlayerRankings(scores);
      
      expect(result[0]).toEqual({ name: 'bob', score: 50, rank: 1 });
      expect(result[1]).toEqual({ name: 'alice', score: 30, rank: 2 });
      expect(result[2]).toEqual({ name: 'charlie', score: 20, rank: 3 });
    });

    it('should handle ascending order', () => {
      const scores = { alice: 30, bob: 20 };
      const result = getPlayerRankings(scores, true);
      
      expect(result[0]).toEqual({ name: 'bob', score: 20, rank: 1 });
      expect(result[1]).toEqual({ name: 'alice', score: 30, rank: 2 });
    });
  });

  describe('calculateRoundStatistics', () => {
    it('should calculate statistics correctly', () => {
      const rounds = [
        { alice: 10, bob: 20 },
        { alice: 30, bob: 40 }
      ];
      const result = calculateRoundStatistics(rounds);
      
      expect(result.totalRounds).toBe(2);
      expect(result.completedRounds).toBe(2);
      expect(result.averageScore).toBe(25);
      expect(result.highestScore).toBe(40);
      expect(result.lowestScore).toBe(10);
    });

    it('should handle empty rounds', () => {
      const result = calculateRoundStatistics([]);
      expect(result.totalRounds).toBe(0);
      expect(result.averageScore).toBe(0);
    });
  });
});