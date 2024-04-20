// Sparticuz/chromium: Chromium (x86-64) for Serverless Platforms 
// https://github.com/Sparticuz/chromium

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import main from './main.mjs';

// Optional: If you'd like to use the new headless mode. "shell" is the default.
// NOTE: Because we build the shell binary, this option does not work.
//       However, this option will stay so when we migrate to full chromium it will work.
chromium.setHeadlessMode = true;

// Optional: If you'd like to disable webgl, true is the default.
// chromium.setGraphicsMode = false;
// 「false」にすると、「const page = await browser.newPage();」で止まる

// Optional: Load any fonts you need. Open Sans is included by default in AWS Lambda instances
// await chromium.font(
//     "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
// );

export async function handler(event) {

    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    try {
        const id = 'testuser';
        await main(page, id);
    } catch (e) {
        console.log(e);
    } finally {
        await page.close();
        await browser.close();
    }

    return 'success!!'
}
