export function generateCombinations(arr: string[], size: number): string[][] {
  if (size <= 0 || size > arr.length) return [];
  if (size === 1) return arr.map(item => [item]);
  if (size === arr.length) return [arr];

  const result: string[][] = [];

  function backtrack(start: number, current: string[]) {
    if (current.length === size) {
      result.push([...current]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return result;
}
