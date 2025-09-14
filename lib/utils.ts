// Round-robin subgroup generation utilities

function generateCombinations(arr: string[], size: number): string[][] {
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

export function generateRoundRobinSubgroups(members: string[], subgroupSize: number): string[][][] {
  if (subgroupSize <= 0 || subgroupSize > members.length) return [];

  if (subgroupSize === 2) {
    return generateRoundRobinPairs(members);
  } else {
    return generateRoundRobinLargerGroups(members, subgroupSize);
  }
}

function generateRoundRobinPairs(members: string[]): string[][][] {
  const n = members.length;
  if (n < 2) return [];

  const rounds: string[][][] = [];
  const players = [...members];

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
        player1Index = 0;
        player2Index = players.length - 1 - round;
      } else {
        player1Index = (pair + round) % (players.length - 1);
        if (player1Index === 0) player1Index = players.length - 1;

        player2Index = (players.length - 1 - pair + round) % (players.length - 1);
        if (player2Index === 0) player2Index = players.length - 1;
      }

      const player1 = players[player1Index];
      const player2 = players[player2Index];

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

function generateRoundRobinLargerGroups(members: string[], subgroupSize: number): string[][][] {
  const n = members.length;
  const rounds: string[][][] = [];
  const pairingHistory = new Map<string, Set<string>>();

  members.forEach(member => {
    pairingHistory.set(member, new Set());
  });

  const maxRounds = Math.ceil((n * (n - 1)) / (2 * (subgroupSize - 1))) * 2;

  for (let roundNum = 0; roundNum < maxRounds; roundNum++) {
    const currentRound: string[][] = [];
    const usedInRound = new Set<string>();
    const availableMembers = members.filter(m => !usedInRound.has(m));

    while (availableMembers.length >= subgroupSize) {
      const group = selectOptimalGroup(availableMembers, subgroupSize, pairingHistory);

      if (group.length === subgroupSize) {
        currentRound.push(group);

        group.forEach(member => {
          usedInRound.add(member);
          availableMembers.splice(availableMembers.indexOf(member), 1);
        });

        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            pairingHistory.get(group[i])?.add(group[j]);
            pairingHistory.get(group[j])?.add(group[i]);
          }
        }
      } else {
        break;
      }
    }

    if (currentRound.length === 0) break;
    rounds.push(currentRound);

    if (hasGoodCoverage(members, pairingHistory, subgroupSize)) {
      break;
    }
  }

  return rounds;
}

function selectOptimalGroup(
  availableMembers: string[],
  subgroupSize: number,
  pairingHistory: Map<string, Set<string>>
): string[] {
  if (availableMembers.length < subgroupSize) return [];

  let bestGroup: string[] = [];
  let lowestScore = Infinity;

  const combinations = generateCombinations(availableMembers, subgroupSize);

  for (const combination of combinations) {
    let score = 0;

    for (let i = 0; i < combination.length; i++) {
      for (let j = i + 1; j < combination.length; j++) {
        if (pairingHistory.get(combination[i])?.has(combination[j])) {
          score += 10;
        }
      }
    }

    if (score < lowestScore) {
      lowestScore = score;
      bestGroup = combination;
    }

    if (score === 0) break;
  }

  return bestGroup;
}

function hasGoodCoverage(
  members: string[],
  pairingHistory: Map<string, Set<string>>,
  subgroupSize: number
): boolean {
  const n = members.length;
  const targetPairings = Math.floor((n - 1) * 0.8);

  for (const member of members) {
    const pairings = pairingHistory.get(member)?.size || 0;
    if (pairings < targetPairings) {
      return false;
    }
  }

  return true;
}
