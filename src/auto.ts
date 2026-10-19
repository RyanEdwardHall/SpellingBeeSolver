import { chromium } from 'playwright';
import { Search } from './search';
import { filterDictionaryFile } from './trie/dictionaryPruner';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto("https://spellsbee.com/", { waitUntil: 'domcontentloaded'});
    await page.waitForFunction(() => {
        const centerLetter = document.querySelector("#keys-middle");
        return centerLetter && centerLetter.textContent !== "";
    });
    
    // dismiss how to play instructions
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
    const exitModal = page.locator("span#popup-exit-alt");
    const wordDoesNotExist = await page.locator("#message.message-bad");
    let victory_modal_count = 0;

    for (const word of words) {
        await page.keyboard.type(word);
        await page.keyboard.press('Enter');

        if (await wordDoesNotExist.isVisible()) {
            rejected_words.push(word);
        }

        // modal blocks keyboard events, needs to be dismissed before progressing
        if (await exitModal.isVisible()) {
            victory_modal_count += 1;
            if (victory_modal_count === 1) { console.log('Genius level achieved' ) }
            if (victory_modal_count === 2) { console.log('All words found!' ) }
            await exitModal.click();
        }
    }

    // Eventually the dictionary will converge to a point where it matches the game's dictionary, at which point the game is effectively solved.
    if (rejected_words.length > 0) {
        await filterDictionaryFile(rejected_words);
    }

    await page.waitForTimeout(5000);
    await browser.close();
}

run();

