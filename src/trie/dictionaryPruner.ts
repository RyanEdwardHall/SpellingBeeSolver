export async function filterDictionaryFile(rejectedWords: string[]) {
  const filePath = './src/trie/words_alpha.txt';
  const file = Bun.file(filePath);
  
  console.log(`Cleaning dictionary. Removing ${rejectedWords.length} rejected words.`);

  const rawText = await file.text();
  const allDictionaryWords = rawText.split(/\r?\n/); 

  // Filter out any words included in our rejected array
  const cleanWords = allDictionaryWords.filter(word => {
    // Keep the word if it is NOT found in the rejected array
    return !rejectedWords.includes(word.trim().toLowerCase());
  });

  // Overwrite the file with the remaining valid words
  await Bun.write(filePath, cleanWords.join('\n'));
  
  console.log(`💾 Dictionary updated successfully! Saved to ${filePath}`);
}

export async function filter8PlusUniqueLetterWords() {
  const filePath = './src/trie/words_alpha.txt';
  const file = Bun.file(filePath);
  
  console.log(`Filtering dictionary for words with 8+ unique letters.`);

  const rawText = await file.text();
  const allDictionaryWords = rawText.split(/\r?\n/);

  // Keep words that have 7 or fewer unique letters
  const filteredWords = allDictionaryWords.filter(word => {
    const uniqueLetters = new Set(word.toLowerCase());
    return uniqueLetters.size <= 7;
  });

  // Overwrite the file with the filtered words
  await Bun.write(filePath, filteredWords.join('\n'));
  
  console.log(`💾 Dictionary updated successfully! Saved to ${filePath}`);
}