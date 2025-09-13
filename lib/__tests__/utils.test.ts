import { generateCombinations } from '../utils';

describe('generateCombinations', () => {
  describe('Edge Cases', () => {
    test('should return empty array when size is greater than array length', () => {
      const result = generateCombinations(['A', 'B'], 3);
      expect(result).toEqual([]);
    });

    test('should return empty array when size is 0', () => {
      const result = generateCombinations(['A', 'B', 'C'], 0);
      expect(result).toEqual([]);
    });

    test('should return empty array for empty input array', () => {
      const result = generateCombinations([], 2);
      expect(result).toEqual([]);
    });

    test('should handle negative size gracefully', () => {
      const result = generateCombinations(['A', 'B'], -1);
      expect(result).toEqual([]);
    });
  });

  describe('Single Element Combinations', () => {
    test('should return individual elements when size is 1', () => {
      const result = generateCombinations(['A', 'B', 'C'], 1);
      expect(result).toEqual([['A'], ['B'], ['C']]);
    });

    test('should return single element for single item array', () => {
      const result = generateCombinations(['X'], 1);
      expect(result).toEqual([['X']]);
    });
  });

  describe('Full Array Combinations', () => {
    test('should return the full array when size equals array length', () => {
      const result = generateCombinations(['A', 'B', 'C'], 3);
      expect(result).toEqual([['A', 'B', 'C']]);
    });

    test('should return single element array when both size and length are 1', () => {
      const result = generateCombinations(['X'], 1);
      expect(result).toEqual([['X']]);
    });
  });

  describe('Pair Combinations (Size 2)', () => {
    test('should generate all pairs from 3 elements', () => {
      const result = generateCombinations(['A', 'B', 'C'], 2);
      expect(result).toEqual([
        ['A', 'B'],
        ['A', 'C'],
        ['B', 'C']
      ]);
    });

    test('should generate all pairs from 4 elements', () => {
      const result = generateCombinations(['A', 'B', 'C', 'D'], 2);
      expect(result).toEqual([
        ['A', 'B'],
        ['A', 'C'],
        ['A', 'D'],
        ['B', 'C'],
        ['B', 'D'],
        ['C', 'D']
      ]);
    });

    test('should generate single pair from 2 elements', () => {
      const result = generateCombinations(['X', 'Y'], 2);
      expect(result).toEqual([['X', 'Y']]);
    });
  });

  describe('Triplet Combinations (Size 3)', () => {
    test('should generate all triplets from 4 elements', () => {
      const result = generateCombinations(['A', 'B', 'C', 'D'], 3);
      expect(result).toEqual([
        ['A', 'B', 'C'],
        ['A', 'B', 'D'],
        ['A', 'C', 'D'],
        ['B', 'C', 'D']
      ]);
    });

    test('should generate all triplets from 5 elements', () => {
      const result = generateCombinations(['A', 'B', 'C', 'D', 'E'], 3);
      const expected = [
        ['A', 'B', 'C'],
        ['A', 'B', 'D'],
        ['A', 'B', 'E'],
        ['A', 'C', 'D'],
        ['A', 'C', 'E'],
        ['A', 'D', 'E'],
        ['B', 'C', 'D'],
        ['B', 'C', 'E'],
        ['B', 'D', 'E'],
        ['C', 'D', 'E']
      ];
      expect(result).toEqual(expected);
    });
  });

  describe('Larger Combinations', () => {
    test('should generate 4-combinations from 5 elements', () => {
      const result = generateCombinations(['A', 'B', 'C', 'D', 'E'], 4);
      expect(result).toEqual([
        ['A', 'B', 'C', 'D'],
        ['A', 'B', 'C', 'E'],
        ['A', 'B', 'D', 'E'],
        ['A', 'C', 'D', 'E'],
        ['B', 'C', 'D', 'E']
      ]);
    });
  });

  describe('Mathematical Properties', () => {
    test('should generate correct number of combinations (C(n,k) formula)', () => {
      // C(4,2) = 6
      const result1 = generateCombinations(['A', 'B', 'C', 'D'], 2);
      expect(result1).toHaveLength(6);

      // C(5,3) = 10
      const result2 = generateCombinations(['A', 'B', 'C', 'D', 'E'], 3);
      expect(result2).toHaveLength(10);

      // C(6,2) = 15
      const result3 = generateCombinations(['A', 'B', 'C', 'D', 'E', 'F'], 2);
      expect(result3).toHaveLength(15);
    });

    test('should maintain lexicographic order', () => {
      const result = generateCombinations(['A', 'B', 'C', 'D'], 2);
      // First element should come before second in each combination
      result.forEach(combo => {
        expect(combo[0] < combo[1]).toBeTruthy();
      });
    });
  });

  describe('Real-world Scenarios', () => {
    test('should handle typical team member names', () => {
      const members = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const pairs = generateCombinations(members, 2);

      expect(pairs).toHaveLength(6);
      expect(pairs).toContainEqual(['Alice', 'Bob']);
      expect(pairs).toContainEqual(['Alice', 'Charlie']);
      expect(pairs).toContainEqual(['Alice', 'Diana']);
      expect(pairs).toContainEqual(['Bob', 'Charlie']);
      expect(pairs).toContainEqual(['Bob', 'Diana']);
      expect(pairs).toContainEqual(['Charlie', 'Diana']);
    });

    test('should handle larger team for triplets', () => {
      const members = ['John', 'Jane', 'Jack', 'Jill', 'Joe'];
      const triplets = generateCombinations(members, 3);

      expect(triplets).toHaveLength(10);
      // Verify a few specific combinations
      expect(triplets).toContainEqual(['John', 'Jane', 'Jack']);
      expect(triplets).toContainEqual(['Jane', 'Jill', 'Joe']);
    });
  });

  describe('Input Validation and Immutability', () => {
    test('should not modify the original array', () => {
      const original = ['A', 'B', 'C'];
      const originalCopy = [...original];

      generateCombinations(original, 2);

      expect(original).toEqual(originalCopy);
    });

    test('should handle arrays with duplicate values correctly', () => {
      // Note: The function treats each position as unique, even if values are the same
      const result = generateCombinations(['A', 'A', 'B'], 2);
      expect(result).toEqual([
        ['A', 'A'],  // First A and second A
        ['A', 'B'],  // First A and B
        ['A', 'B']   // Second A and B
      ]);
      expect(result).toHaveLength(3);
    });

    test('should handle special characters and numbers', () => {
      const result = generateCombinations(['1', '@', '#', '$'], 2);
      expect(result).toHaveLength(6);
      expect(result).toContainEqual(['1', '@']);
      expect(result).toContainEqual(['#', '$']);
    });
  });

  describe('Performance and Memory', () => {
    test('should handle reasonable sized arrays efficiently', () => {
      const largeArray = Array.from({ length: 10 }, (_, i) => `Item${i}`);
      const start = performance.now();
      const result = generateCombinations(largeArray, 3);
      const end = performance.now();

      // C(10,3) = 120
      expect(result).toHaveLength(120);
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should return new array instances (deep copy)', () => {
      const result = generateCombinations(['A', 'B', 'C'], 2);

      // Modify one combination
      result[0][0] = 'Modified';

      // Other combinations should be unaffected
      expect(result[1]).not.toContain('Modified');
      expect(result[2]).not.toContain('Modified');
    });
  });
});
