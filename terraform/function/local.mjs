import puppeteer from 'puppeteer-core';
import main from './main.mjs';

const browser = await puppeteer.launch({
    executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false,
})
const page = await browser.newPage();

try {
    const id = 'local';
    await main(page, id);
} catch (e) {
    console.log(e);
} finally {
    await page.close();
    await browser.close();
}
