import Trie from "./trie/trie";
import percom from "percom";
import { uniq } from "lodash";

export function Search(letters: Array<string>, anchor: string): string[] {
    const bounds = [...Array(6).keys()];

    const words = bounds.reduce((acc, index) => {
        const combs_of_len_n = percom.com(letters, index + 2);
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

    const sorted = uniq(words.flat().sort());
    const result = sorted.filter((arr) => arr.includes(anchor));

    return result;
}