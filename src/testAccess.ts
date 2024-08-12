import fs from 'node:fs';
import path from 'node:path';
import { fillForm } from '@automatic-reservation-itr/fillForm';
import { type Page, executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';

(async () => {
  // テスト用に変更可能、いつ実行するかの日付みたいなもの
  const dt = new Date();
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
  });
  const page: Page = await browser.newPage();

  try {
    const dirPath = path.join(__dirname, 'ss');
    for (const file of fs.readdirSync(dirPath)) {
      fs.rmSync(`${dirPath}/${file}`);
    }
    await page.goto(
      'https://as.its-kenpo.or.jp/apply/restaurant_empty_new?s=PT1BTzNnVFBrbG1KbFZuYzAxVFp5Vkhkd0YyWWZWR2JuOTJiblpTWjFKSGQ5a0hkdzFXWg%3D%3D',
      {
        waitUntil: 'domcontentloaded',
      },
    );

    await fillForm(page, dt, true);
  } catch (e) {
    // @ts-ignore
    console.error(e.stack);
  } finally {
    await browser.close();
  }
})();
