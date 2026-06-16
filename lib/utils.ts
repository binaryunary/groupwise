// Pairwise round-robin generation utilities

/**
 * Generates a complete round-robin tournament for pairs where every member pairs with every other member exactly once.
 * Only supports subgroup size of 2 (pairs).
 */
export function generateRoundRobinSubgroups(members: string[], subgroupSize: number): string[][][] {
  if (subgroupSize !== 2) {
    throw new Error('Only pairwise round-robin (subgroup size 2) is supported');
  }

  // Each participant is a distinct identity, so duplicate names would otherwise
  // pair a participant with "themselves" or with the same partner more than once.
  const players = [...new Set(members)];

  if (players.length < 2) return [];

  // Odd number of participants: add a "bye" so every round is a perfect matching.
  if (players.length % 2 === 1) {
    players.push('BYE');
  }

  const numPlayers = players.length;
  const numRounds = numPlayers - 1;
  const numPairsPerRound = numPlayers / 2;
  const rounds: string[][][] = [];

  // Circle method: position 0 stays fixed while the remaining positions rotate.
  // In every round each player appears in exactly one pair.
  const positions = players.map((_, index) => index);

  for (let round = 0; round < numRounds; round++) {
    const currentRound: string[][] = [];

    for (let pair = 0; pair < numPairsPerRound; pair++) {
      const player1 = players[positions[pair]];
      const player2 = players[positions[numPlayers - 1 - pair]];

      // Skip pairs with the "BYE" placeholder.
      if (player1 !== 'BYE' && player2 !== 'BYE') {
        currentRound.push([player1, player2]);
      }
    }

    if (currentRound.length > 0) {
      rounds.push(currentRound);
    }

    // Rotate every position except the fixed one (index 0).
    const last = positions[numPlayers - 1];
    for (let i = numPlayers - 1; i > 1; i--) {
      positions[i] = positions[i - 1];
    }
    positions[1] = last;
  }

  return rounds;
}
