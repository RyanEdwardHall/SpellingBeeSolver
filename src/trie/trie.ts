const WORDS_KEY = "__WORDS__";
type Node = Map<string, string[] | Node>;

async function load() {
  const wordFile = Bun.file("./src/trie/words_alpha.txt");
  const text = await wordFile.text();
  const words = text.split("\r\n");
  const trie = words.reduce((trie, word) => {
    return insertWord(trie, word);
  }, new Map() as Node);
  return trie;
}

function insertWord(trie: Node, word: string) {
  const letters = Array.from(word).sort();
  return insertAt(trie, letters, word);
}

function insertAt(node: Node, letters: string[], word: string) {
  if (letters.length === 0) {
    const list = (node.get(WORDS_KEY) ?? []) as string[];
    list.push(word);
    return node.set(WORDS_KEY, list);
  }

  const letter = letters.shift() as string;
  if (!node.has(letter)) {
    node.set(letter, new Map() as Node);
  }
  insertAt(node.get(letter), letters, word);
  return node;
}

const structure = await load();

function searchTrie(letters, node, key) {
  if (typeof node === "undefined") return [];
  const found = [...(node.get(WORDS_KEY) ?? [])];

  if (node.has(key)) {
    found.push(...searchTrie([...letters], node.get(key), key));
  }

  if (letters.length > 0) {
    const newKey = letters[0];
    found.push(...searchTrie(letters.slice(1), node.get(newKey), newKey));
  }

  return found.filter(Boolean);
}

const Trie = {
  data: structure,
  search: function (word: string) {
    const sortedWord = Array.from(word).sort();
    return searchTrie(sortedWord, this.data, "");
  },
};

export default Trie;
