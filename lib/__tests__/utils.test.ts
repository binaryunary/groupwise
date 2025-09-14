import { generateRoundRobinSubgroups } from '../utils';

describe('generateRoundRobinSubgroups', () => {
  describe('Edge Cases', () => {
    test('should throw error when subgroup size is not 2', () => {
      expect(() => generateRoundRobinSubgroups(['A', 'B', 'C'], 3)).toThrow('Only pairwise round-robin (subgroup size 2) is supported');
      expect(() => generateRoundRobinSubgroups(['A', 'B', 'C'], 1)).toThrow('Only pairwise round-robin (subgroup size 2) is supported');
      expect(() => generateRoundRobinSubgroups(['A', 'B', 'C'], 4)).toThrow('Only pairwise round-robin (subgroup size 2) is supported');
    });

    test('should return empty array for empty input array', () => {
      const result = generateRoundRobinSubgroups([], 2);
      expect(result).toEqual([]);
    });

    test('should return empty array for single member', () => {
      const result = generateRoundRobinSubgroups(['A'], 2);
      expect(result).toEqual([]);
    });
  });

  describe('Pairwise Round Robin', () => {
    test('should generate round-robin pairs for 4 members', () => {
      const members = ['A', 'B', 'C', 'D'];
      const result = generateRoundRobinSubgroups(members, 2);

      // Should have 3 rounds (n-1 for even number)
      expect(result).toHaveLength(3);

      // Each round should have 2 pairs
      result.forEach(round => {
        expect(round).toHaveLength(2);
        round.forEach(pair => {
          expect(pair).toHaveLength(2);
        });
      });

      // Verify everyone plays everyone exactly once
      const allPairs = result.flat();
      const pairings = new Set();
      allPairs.forEach(pair => {
        const sorted = pair.sort().join('-');
        expect(pairings.has(sorted)).toBe(false);
        pairings.add(sorted);
      });

      // Should have 6 total pairs
      expect(pairings.size).toBe(6);
    });

    test('should generate round-robin pairs for 5 members (odd)', () => {
      const members = ['A', 'B', 'C', 'D', 'E'];
      const result = generateRoundRobinSubgroups(members, 2);

      // Should have 5 rounds for odd number
      expect(result).toHaveLength(5);

      // Each round should have 2 pairs
      result.forEach(round => {
        expect(round).toHaveLength(2);
        round.forEach(pair => {
          expect(pair).toHaveLength(2);
        });
      });
    });

    test('should generate correct number of pairs', () => {
      const members = ['A', 'B', 'C', 'D', 'E', 'F'];
      const result = generateRoundRobinSubgroups(members, 2);

      // Count total pairs generated
      const allPairs = result.flat();
      const pairSet = new Set();

      allPairs.forEach(pair => {
        const sorted = pair.sort().join('-');
        pairSet.add(sorted);
      });

      // Should have exactly C(6,2) = 15 unique pairs
      expect(pairSet.size).toBe(15);
    });
  });
});
