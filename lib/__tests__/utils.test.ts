import { generateRoundRobinSubgroups } from '../utils';

describe('generateRoundRobinSubgroups', () => {
  describe('Edge Cases', () => {
    test('should return empty array when subgroup size is greater than members length', () => {
      const result = generateRoundRobinSubgroups(['A', 'B'], 3);
      expect(result).toEqual([]);
    });

    test('should return empty array when subgroup size is 0', () => {
      const result = generateRoundRobinSubgroups(['A', 'B', 'C'], 0);
      expect(result).toEqual([]);
    });

    test('should return empty array for empty input array', () => {
      const result = generateRoundRobinSubgroups([], 2);
      expect(result).toEqual([]);
    });

    test('should handle negative size gracefully', () => {
      const result = generateRoundRobinSubgroups(['A', 'B', 'C'], -1);
      expect(result).toEqual([]);
    });
  });

  describe('Pairs (size 2)', () => {
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
  });

  describe('Larger groups (size 3+)', () => {
    test('should generate round-robin groups of size 3', () => {
      const members = ['A', 'B', 'C', 'D', 'E', 'F'];
      const result = generateRoundRobinSubgroups(members, 3);

      expect(result.length).toBeGreaterThan(0);

      // Each group should have exactly 3 members
      result.forEach(round => {
        round.forEach(group => {
          expect(group).toHaveLength(3);
        });
      });
    });

    test('should minimize repeat pairings in larger groups', () => {
      const members = ['A', 'B', 'C', 'D', 'E', 'F'];
      const result = generateRoundRobinSubgroups(members, 3);

      // Track all pairings across all rounds
      const pairings = new Map();

      result.forEach(round => {
        round.forEach(group => {
          // Count all pairs within this group
          for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
              const pair = [group[i], group[j]].sort().join('-');
              pairings.set(pair, (pairings.get(pair) || 0) + 1);
            }
          }
        });
      });

      // Should have good coverage
      expect(pairings.size).toBeGreaterThan(10);
    });
  });
});
