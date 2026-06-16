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

  describe('Round Robin Invariants', () => {
    // Every participant must be paired with every other participant exactly
    // once, never with themselves, and never twice within the same round.
    const sizes = [2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 16, 23, 30];

    test.each(sizes)('produces a valid schedule for %i members', (n) => {
      const members = Array.from({ length: n }, (_, i) => `P${i}`);
      const result = generateRoundRobinSubgroups(members, 2);

      const seenPairs = new Map<string, number>();

      result.forEach(round => {
        const seenInRound = new Set<string>();
        round.forEach(([a, b]) => {
          // Never paired with themselves.
          expect(a).not.toBe(b);

          // Each participant appears at most once per round.
          expect(seenInRound.has(a)).toBe(false);
          expect(seenInRound.has(b)).toBe(false);
          seenInRound.add(a);
          seenInRound.add(b);

          const key = [a, b].sort().join('-');
          seenPairs.set(key, (seenPairs.get(key) ?? 0) + 1);
        });

        // For an even number of participants everyone plays every round.
        if (n % 2 === 0) {
          expect(seenInRound.size).toBe(n);
        }
      });

      // Every pair occurs exactly once.
      seenPairs.forEach(count => expect(count).toBe(1));

      // The schedule is complete: C(n, 2) unique pairs.
      expect(seenPairs.size).toBe((n * (n - 1)) / 2);
    });
  });

  describe('Duplicate participants', () => {
    test('never pairs a duplicated name with itself', () => {
      const result = generateRoundRobinSubgroups(['Alice', 'Bob', 'Alice', 'Charlie'], 2);
      const allPairs = result.flat();

      allPairs.forEach(([a, b]) => expect(a).not.toBe(b));
    });

    test('treats duplicate names as a single participant', () => {
      const result = generateRoundRobinSubgroups(['Alice', 'Bob', 'Alice', 'Charlie'], 2);
      const pairings = new Set<string>();

      result.flat().forEach(pair => {
        const sorted = [...pair].sort().join('-');
        // No pairing occurs more than once.
        expect(pairings.has(sorted)).toBe(false);
        pairings.add(sorted);
      });

      // Unique participants are Alice, Bob, Charlie -> C(3,2) = 3 pairs.
      expect(pairings.size).toBe(3);
    });
  });
});
