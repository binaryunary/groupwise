// Subgroup generation utilities: pairwise round-robin, single splits, and
// multi-round rotations for arbitrary group sizes.

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

/**
 * Returns a new array with the items in random order (Fisher–Yates shuffle).
 * The input array is left untouched.
 */
function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Computes the size of each group when splitting `n` members into groups of
 * roughly `groupSize`.
 *
 * The number of groups is floor(n / groupSize) (at least one), and any leftover
 * members are spread one-per-group so the groups stay as even as possible. Each
 * group therefore ends up with at least `groupSize` members, and some get one
 * extra (e.g. 7 in 3s -> [4, 3]).
 */
function groupSizesFor(n: number, groupSize: number): number[] {
  const numGroups = Math.max(1, Math.floor(n / groupSize));
  const base = Math.floor(n / numGroups);
  const remainder = n % numGroups;

  return Array.from({ length: numGroups }, (_, i) => (i < remainder ? base + 1 : base));
}

const pairKey = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);

/**
 * Splits members into a single set of groups of roughly `groupSize`.
 *
 * Members are shuffled, duplicate names are treated as a single participant, and
 * leftovers are distributed so the groups are as even as possible (some groups
 * may have one extra member). Returns an empty array for fewer than 2 unique
 * members.
 */
export function splitIntoGroups(members: string[], groupSize: number): string[][] {
  const players = [...new Set(members)];
  if (players.length < 2) return [];

  const size = Math.max(2, groupSize);
  const shuffled = shuffle(players);
  const sizes = groupSizesFor(shuffled.length, size);

  const groups: string[][] = [];
  let index = 0;
  for (const groupSizeForRound of sizes) {
    groups.push(shuffled.slice(index, index + groupSizeForRound));
    index += groupSizeForRound;
  }

  return groups;
}

/**
 * Generates a multi-round rotation: `numRounds` rounds, each splitting every
 * member into groups of roughly `groupSize`.
 *
 * For pairs (groupSize 2) this reuses the perfect round-robin schedule, capped
 * at the requested number of rounds (never more than n-1, after which pairs must
 * repeat). For larger groups it uses a greedy heuristic that assigns each member
 * to the group that adds the fewest already-seen pairings, which keeps repeat
 * co-memberships low across rounds. Returns an empty array for fewer than 2
 * unique members or a non-positive round count.
 */
export function generateRotationRounds(
  members: string[],
  groupSize: number,
  numRounds: number
): string[][][] {
  const players = [...new Set(members)];
  if (players.length < 2 || numRounds <= 0) return [];

  const size = Math.max(2, groupSize);

  // Pairs: the circle method already yields a perfect, well-tested schedule.
  if (size === 2) {
    return generateRoundRobinSubgroups(players, 2).slice(0, numRounds);
  }

  const sizes = groupSizesFor(players.length, size);
  const seenPairs = new Set<string>();
  const rounds: string[][][] = [];

  // Builds one candidate round and returns it with the number of repeat pairings
  // it introduces, greedily placing each member into the least-conflicting group.
  const buildRound = (): { groups: string[][]; cost: number } => {
    const groups: string[][] = sizes.map(() => []);
    let cost = 0;

    for (const person of shuffle(players)) {
      let bestGroup = -1;
      let bestCost = Infinity;

      for (let g = 0; g < groups.length; g++) {
        if (groups[g].length >= sizes[g]) continue;

        let conflicts = 0;
        for (const member of groups[g]) {
          if (seenPairs.has(pairKey(person, member))) conflicts++;
        }

        // Prefer fewer repeat pairings, breaking ties towards the emptier group.
        if (
          conflicts < bestCost ||
          (conflicts === bestCost && bestGroup >= 0 && groups[g].length < groups[bestGroup].length)
        ) {
          bestCost = conflicts;
          bestGroup = g;
        }
      }

      groups[bestGroup].push(person);
      cost += bestCost;
    }

    return { groups, cost };
  };

  for (let round = 0; round < numRounds; round++) {
    // The greedy result depends on the (shuffled) processing order, so try a few
    // restarts and keep the round that introduces the fewest repeat pairings.
    let best = buildRound();
    for (let attempt = 1; attempt < 25 && best.cost > 0; attempt++) {
      const candidate = buildRound();
      if (candidate.cost < best.cost) best = candidate;
    }

    // Record every co-membership so later rounds can avoid repeating it.
    for (const group of best.groups) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          seenPairs.add(pairKey(group[i], group[j]));
        }
      }
    }

    rounds.push(best.groups);
  }

  return rounds;
}
