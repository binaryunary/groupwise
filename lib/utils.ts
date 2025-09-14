// Pairwise round-robin generation utilities

/**
 * Generates a complete round-robin tournament for pairs where every member pairs with every other member exactly once.
 * Only supports subgroup size of 2 (pairs).
 */
export function generateRoundRobinSubgroups(members: string[], subgroupSize: number): string[][][] {
  if (subgroupSize !== 2) {
    throw new Error('Only pairwise round-robin (subgroup size 2) is supported');
  }

  if (members.length < 2) return [];

  const rounds: string[][][] = [];
  const players = [...members];

  // If odd number of players, add a "bye" player
  if (players.length % 2 === 1) {
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
