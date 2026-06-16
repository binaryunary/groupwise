# Test Documentation for `lib/utils.ts`

## Overview
Unit tests for the subgroup generation utilities that power GroupWise. The suite
covers three functions:

- `generateRoundRobinSubgroups` — pairwise round-robin schedule (size 2).
- `splitIntoGroups` — a single split into groups of a chosen size.
- `generateRotationRounds` — a multi-round rotation for any group size.

## Test Categories

### 🚫 Edge Cases
- Empty input and single-member input return `[]`.
- `generateRoundRobinSubgroups` only supports size 2 (throws otherwise).
- `generateRotationRounds` returns `[]` for a non-positive round count.

### 🔁 Pairwise Round Robin (`generateRoundRobinSubgroups`)
- Even participant counts: `n - 1` rounds, everyone plays every round.
- Odd participant counts: a "bye" is added so every round is a perfect matching.
- Every pair occurs exactly once: `C(n, 2)` unique pairs.
- Duplicate names are treated as a single participant.

### 👥 Single Split (`splitIntoGroups`)
- Leftovers are distributed so groups stay as even as possible
  (e.g. 7 in 3s → `4 + 3`, sizes differ by at most 1).
- Evenly divisible inputs produce equal groups (e.g. 12 in 3s → four groups of 3).
- Fewer members than the group size keeps everyone in one group.
- Every member appears exactly once; duplicate names are deduped.

### 🔄 Multi-round Rotation (`generateRotationRounds`)
- Pairs reuse the perfect round-robin, capped at `n - 1` rounds.
- The requested number of rounds is honoured for larger groups.
- Each round is an even partition of all members.
- A greedy heuristic keeps repeat co-memberships low; the quality assertion runs
  against a seeded RNG so it is deterministic.

## Running Tests

```bash
# Run all tests
npm test

# Run only the utils suite
npx jest lib/__tests__/utils.test.ts
```
