import { generateRoundRobinSubgroups, splitIntoGroups, generateRotationRounds } from '../utils';

// Helpers shared across the new suites.
const makeMembers = (n: number): string[] => Array.from({ length: n }, (_, i) => `P${i}`);

// Asserts a set of groups is an even partition of `n` members into groups of
// roughly `groupSize` (floor(n/groupSize) groups, sizes differing by at most 1).
const expectEvenPartition = (groups: string[][], n: number, groupSize: number): void => {
  const numGroups = Math.max(1, Math.floor(n / groupSize));
  expect(groups).toHaveLength(numGroups);

  const sizes = groups.map(g => g.length);
  expect(sizes.reduce((a, b) => a + b, 0)).toBe(n);
  expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1);

  const flat = groups.flat();
  expect(flat).toHaveLength(n);
  expect(new Set(flat).size).toBe(n);
};

// Deterministic RNG so heuristic-quality assertions never flake.
const seededRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

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

describe('splitIntoGroups', () => {
  test('returns an empty array for fewer than 2 members', () => {
    expect(splitIntoGroups([], 2)).toEqual([]);
    expect(splitIntoGroups(['A'], 3)).toEqual([]);
  });

  test('distributes leftovers evenly (7 in 3s -> 4 + 3)', () => {
    const groups = splitIntoGroups(makeMembers(7), 3);
    expectEvenPartition(groups, 7, 3);
    expect(groups.map(g => g.length).sort()).toEqual([3, 4]);
  });

  test('produces equal groups when evenly divisible (12 in 3s)', () => {
    const groups = splitIntoGroups(makeMembers(12), 3);
    expectEvenPartition(groups, 12, 3);
    expect(groups.map(g => g.length)).toEqual([3, 3, 3, 3]);
  });

  test('keeps everyone in one group when there are fewer members than the size', () => {
    const groups = splitIntoGroups(makeMembers(3), 5);
    expect(groups).toHaveLength(1);
    expect(groups[0]).toHaveLength(3);
  });

  test('treats duplicate names as a single participant', () => {
    const groups = splitIntoGroups(['Alice', 'Bob', 'Alice', 'Charlie'], 2);
    const flat = groups.flat();
    expect(new Set(flat).size).toBe(flat.length);
    expect([...flat].sort()).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  test.each([2, 3, 4, 5])('every member appears exactly once for size %i', (size) => {
    expectEvenPartition(splitIntoGroups(makeMembers(13), size), 13, size);
  });
});

describe('generateRotationRounds', () => {
  test('returns an empty array for invalid input', () => {
    expect(generateRotationRounds([], 2, 3)).toEqual([]);
    expect(generateRotationRounds(['A'], 2, 3)).toEqual([]);
    expect(generateRotationRounds(makeMembers(6), 3, 0)).toEqual([]);
    expect(generateRotationRounds(makeMembers(6), 3, -1)).toEqual([]);
  });

  describe('pairs (size 2)', () => {
    test('reproduces a perfect round-robin for n-1 rounds', () => {
      const n = 8;
      const rounds = generateRotationRounds(makeMembers(n), 2, n - 1);
      expect(rounds).toHaveLength(n - 1);

      const seenPairs = new Map<string, number>();
      rounds.forEach(round => {
        const seenInRound = new Set<string>();
        round.forEach(pair => {
          expect(pair).toHaveLength(2);
          pair.forEach(p => {
            expect(seenInRound.has(p)).toBe(false);
            seenInRound.add(p);
          });
          const key = [...pair].sort().join('-');
          seenPairs.set(key, (seenPairs.get(key) ?? 0) + 1);
        });
        expect(seenInRound.size).toBe(n);
      });

      seenPairs.forEach(count => expect(count).toBe(1));
      expect(seenPairs.size).toBe((n * (n - 1)) / 2);
    });

    test('caps rounds at n-1 even when more are requested', () => {
      const n = 6;
      expect(generateRotationRounds(makeMembers(n), 2, 100)).toHaveLength(n - 1);
    });

    test('returns exactly the requested number of rounds when below the cap', () => {
      expect(generateRotationRounds(makeMembers(8), 2, 3)).toHaveLength(3);
    });
  });

  describe('larger groups (size > 2)', () => {
    test('produces the requested number of rounds', () => {
      expect(generateRotationRounds(makeMembers(9), 3, 6)).toHaveLength(6);
    });

    test('each round is an even partition of everyone', () => {
      const rounds = generateRotationRounds(makeMembers(11), 3, 4);
      expect(rounds).toHaveLength(4);
      rounds.forEach(round => expectEvenPartition(round, 11, 3));
    });

    test('covers most pairs without heavy repetition (9 in 3s over 4 rounds)', () => {
      const spy = jest.spyOn(Math, 'random').mockImplementation(seededRandom(42));
      try {
        const rounds = generateRotationRounds(makeMembers(9), 3, 4);
        const seenPairs = new Map<string, number>();
        rounds.forEach(round => round.forEach(group => {
          for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
              const key = [group[i], group[j]].sort().join('-');
              seenPairs.set(key, (seenPairs.get(key) ?? 0) + 1);
            }
          }
        }));

        // A perfect resolvable design exists (C(9,2) = 36 pairs over 36 slots);
        // the greedy heuristic should cover most pairs and avoid heavy repeats.
        expect(seenPairs.size).toBeGreaterThanOrEqual(30);
        seenPairs.forEach(count => expect(count).toBeLessThanOrEqual(2));
      } finally {
        spy.mockRestore();
      }
    });
  });
});
