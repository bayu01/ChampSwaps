import { filter, flatMap, indexOf, max, reduce, sumBy, uniqBy } from "lodash-es";

export function maximizeScore(sets) {
  console.log("Number of datasets to evaluate: ", sets.length);
  console.log("Number of elements on first dataset: ",sets[0].length);
  console.log("Number of combinations to evaluate: ", sets[0].length ** sets.length)

  // Generate a cartesian product of all the sets
  const combinations = reduce(sets, (acc, set) => flatMap(acc, items => set.map(item => [...items, item])), [[]]);

// Filter out the combinations that have duplicate types
  const uniqueCombinations = filter(combinations, combination => uniqBy(combination, 'championId').length === sets.length);

// Compute the scores for each combination
  const scores = uniqueCombinations.map(combination => sumBy(combination, 'championPoints'));

// Find the combination with the highest score
  const optimalCombination = uniqueCombinations[indexOf(scores, max(scores))];

  console.log('optimalCombination', optimalCombination);
  return optimalCombination
}
