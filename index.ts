import Trie from "./src/trie/trie";
import percom from "percom";
import { input } from "@inquirer/prompts";
import { groupBy, uniq } from "lodash";

const anchor = await input({
  message: "What is the central letter?",
});

const others = await input({
  message: "What are the supporting letters?",
  validate: function (input: string) {
    return /^[a-zA-Z]{6}$/.test(input) || "Please enter exactly 6 letters.";
  },
});

const search_letters = anchor + others;
const letter_array = Array.from(search_letters);
const bounds = [...Array(6).keys()];

const words = bounds.reduce((acc, index) => {
  const combs_of_len_n = percom.com(letter_array, index + 2);
  const combs_with_anchor = combs_of_len_n.filter((arr) =>
    arr.includes(anchor),
  );

  const found = combs_with_anchor.reduce((results, combination) => {
    const comb_to_search = combination.join("");
    const found_words = Trie.search(comb_to_search).filter((n) => n.length > 3);
    results.push(found_words);
    return results;
  }, []);

  acc.push(found.flat());
  return acc;
}, []);

// final filter, as some letter chains will find words without anchor
const sorted = uniq(words.flat().sort());
const result = sorted.filter((arr) => arr.includes(anchor));
console.log(groupBy(result, "length"));
