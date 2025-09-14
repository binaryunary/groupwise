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

/**
 * Generates non-overlapping subgroups that can work in parallel.
 * Returns an array of "rounds" where each round contains subgroups that can work simultaneously.
 */
export function generateParallelSubgroups(members: string[], subgroupSize: number): string[][][] {
  if (subgroupSize <= 0 || subgroupSize > members.length) return [];

  const rounds: string[][][] = [];
  const availableMembers = [...members];

  while (availableMembers.length >= subgroupSize) {
    const currentRound: string[][] = [];
    const usedInThisRound = new Set<string>();

    // Greedily form as many non-overlapping groups as possible in this round
    for (let i = 0; i <= availableMembers.length - subgroupSize; i += subgroupSize) {
      const group: string[] = [];

      // Try to form a group starting from position i
      for (let j = i; j < availableMembers.length && group.length < subgroupSize; j++) {
        const member = availableMembers[j];
        if (!usedInThisRound.has(member)) {
          group.push(member);
          usedInThisRound.add(member);
        }
      }

      // If we formed a complete group, add it to the round
      if (group.length === subgroupSize) {
        currentRound.push(group);
      }
    }

    // If we couldn't form any groups in this round, break
    if (currentRound.length === 0) break;

    rounds.push(currentRound);

    // Remove used members from available pool
    availableMembers.splice(0, availableMembers.length);
    members.forEach(member => {
      if (!usedInThisRound.has(member)) {
        availableMembers.push(member);
      }
    });
  }

  return rounds;
}

/**
 * Optimized version that tries different permutations to maximize parallel groups
 */
export function generateOptimalParallelSubgroups(members: string[], subgroupSize: number): string[][][] {
  if (subgroupSize <= 0 || subgroupSize > members.length) return [];

  let bestResult: string[][][] = [];
  let maxTotalGroups = 0;

  // Try a few different random shuffles to find optimal grouping
  const attempts = Math.min(10, members.length);

  for (let attempt = 0; attempt < attempts; attempt++) {
    const shuffledMembers = [...members];

    // Shuffle for this attempt (except first attempt which uses original order)
    if (attempt > 0) {
      for (let i = shuffledMembers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledMembers[i], shuffledMembers[j]] = [shuffledMembers[j], shuffledMembers[i]];
      }
    }

    const result = generateParallelSubgroups(shuffledMembers, subgroupSize);
    const totalGroups = result.reduce((sum, round) => sum + round.length, 0);

    if (totalGroups > maxTotalGroups) {
      maxTotalGroups = totalGroups;
      bestResult = result;
    }
  }

  return bestResult;
}

/**
 * Generates a complete round-robin tournament where every member pairs with every other member.
 * For pairs (size 2), this creates a schedule where everyone plays everyone else exactly once.
 * For larger groups, it tries to minimize repeat pairings while ensuring everyone participates.
 */
export function generateRoundRobinSubgroups(members: string[], subgroupSize: number): string[][][] {
  if (subgroupSize <= 0 || subgroupSize > members.length) return [];

  if (subgroupSize === 2) {
    return generateRoundRobinPairs(members);
  } else {
    return generateRoundRobinLargerGroups(members, subgroupSize);
  }
}

/**
 * Creates a perfect round-robin schedule for pairs where everyone plays everyone else exactly once.
 */
function generateRoundRobinPairs(members: string[]): string[][][] {
  const n = members.length;
  if (n < 2) return [];

  // For round-robin pairs, we need (n-1) rounds if n is even, or n rounds if n is odd
  const rounds: string[][][] = [];
  const players = [...members];

  // If odd number of players, add a "bye" player
  if (n % 2 === 1) {
    players.push('BYE');
  }

  const numRounds = players.length - 1;
  const numPairsPerRound = players.length / 2;

  for (let round = 0; round < numRounds; round++) {
    const currentRound: string[][] = [];

    for (let pair = 0; pair < numPairsPerRound; pair++) {
      let player1Index: number;
      let player2Index: number;

      if (pair === 0) {
        // First pair: always includes the first player (fixed position)
        player1Index = 0;
        player2Index = players.length - 1 - round;
      } else {
        // Other pairs: rotate around the circle
        player1Index = (pair + round) % (players.length - 1);
        if (player1Index === 0) player1Index = players.length - 1;

        player2Index = (players.length - 1 - pair + round) % (players.length - 1);
        if (player2Index === 0) player2Index = players.length - 1;
      }

      const player1 = players[player1Index];
      const player2 = players[player2Index];

      // Skip pairs with "BYE" player
      if (player1 !== 'BYE' && player2 !== 'BYE') {
        currentRound.push([player1, player2]);
      }
    }

    if (currentRound.length > 0) {
      rounds.push(currentRound);
    }
  }

  return rounds;
}

/**
 * Creates round-robin schedule for larger groups (3+).
 * Uses a modified approach to minimize repeat pairings while ensuring fair participation.
 */
function generateRoundRobinLargerGroups(members: string[], subgroupSize: number): string[][][] {
  const n = members.length;
  const rounds: string[][][] = [];
  const pairingHistory = new Map<string, Set<string>>();

  // Initialize pairing history
  members.forEach(member => {
    pairingHistory.set(member, new Set());
  });

  // Calculate how many rounds we need to ensure good coverage
  const maxRounds = Math.ceil((n * (n - 1)) / (2 * (subgroupSize - 1))) * 2;

  for (let roundNum = 0; roundNum < maxRounds; roundNum++) {
    const currentRound: string[][] = [];
    const usedInRound = new Set<string>();
    const availableMembers = members.filter(m => !usedInRound.has(m));

    while (availableMembers.length >= subgroupSize) {
      const group = selectOptimalGroup(availableMembers, subgroupSize, pairingHistory);

      if (group.length === subgroupSize) {
        currentRound.push(group);

        // Mark members as used in this round
        group.forEach(member => {
          usedInRound.add(member);
          availableMembers.splice(availableMembers.indexOf(member), 1);
        });

        // Update pairing history
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            pairingHistory.get(group[i])?.add(group[j]);
            pairingHistory.get(group[j])?.add(group[i]);
          }
        }
      } else {
        break; // Can't form a complete group
      }
    }

    if (currentRound.length === 0) break; // No more groups can be formed
    rounds.push(currentRound);

    // Check if we've achieved good coverage
    if (hasGoodCoverage(members, pairingHistory, subgroupSize)) {
      break;
    }
  }

  return rounds;
}

/**
 * Selects the optimal group that minimizes repeat pairings.
 */
function selectOptimalGroup(
  availableMembers: string[],
  subgroupSize: number,
  pairingHistory: Map<string, Set<string>>
): string[] {
  if (availableMembers.length < subgroupSize) return [];

  let bestGroup: string[] = [];
  let lowestScore = Infinity;

  // Try different combinations and pick the one with least repeat pairings
  const combinations = generateCombinations(availableMembers, subgroupSize);

  for (const combination of combinations) {
    let score = 0;

    // Calculate score based on existing pairings
    for (let i = 0; i < combination.length; i++) {
      for (let j = i + 1; j < combination.length; j++) {
        if (pairingHistory.get(combination[i])?.has(combination[j])) {
          score += 10; // Penalty for repeat pairing
        }
      }
    }

    if (score < lowestScore) {
      lowestScore = score;
      bestGroup = combination;
    }

    // If we found a group with no repeat pairings, use it immediately
    if (score === 0) break;
  }

  return bestGroup;
}

/**
 * Checks if we have good coverage of pairings across all members.
 */
function hasGoodCoverage(
  members: string[],
  pairingHistory: Map<string, Set<string>>,
  subgroupSize: number
): boolean {
  const n = members.length;
  const targetPairings = Math.floor((n - 1) * 0.8); // Aim for 80% coverage

  for (const member of members) {
    const pairings = pairingHistory.get(member)?.size || 0;
    if (pairings < targetPairings) {
      return false;
    }
  }

  return true;
}
