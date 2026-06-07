import { chromium } from 'playwright';
import { Search } from './search';
import { filterDictionaryFile } from './trie/dictionaryPruner';

async function run() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    
    await page.goto("https://spellsbee.com/", { waitUntil: 'domcontentloaded'});
    await page.waitForFunction(() => {
        const centerLetter = document.querySelector("#keys-middle");
        return centerLetter && centerLetter.textContent !== "";
    });
    
    await page.click('#popup-exit');
    
    // scrape letters
    const allLetters = (await page.locator(".keys-letter").allInnerTexts()).map(l => l.toLowerCase());
    const centerLetter = (await page.locator("#keys-middle").textContent())!.toLowerCase();
    
    console.log("All Letters: ", allLetters);
    console.log("Centeral Letter: ", centerLetter);
    
    const words = Search(allLetters, centerLetter!);
    console.log(`Found ${words.length} words`);
    
    const rejected_words = [];
    
    // attempt to input words into the game
    const wordDoesNotExist = await page.locator("#message.message-bad");
    for (const word of words) {
        await page.keyboard.type(word);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(200); // wait for the game to process the input

        // check if the word was accepted or rejected
        if (await wordDoesNotExist.isVisible()) {
            rejected_words.push(word);
        }
    }

    if (rejected_words.length > 0) {
        await filterDictionaryFile(rejected_words);
    }
    
    await page.waitForTimeout(5000);
    await browser.close();
}

run(); 