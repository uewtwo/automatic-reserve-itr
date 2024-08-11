import '@automatic-reservation-itr/puppeteer-setup';
import fs from 'node:fs';
import { isRestaurant } from '@automatic-reservation-itr/constants/Restaurant';
import { reserve } from '@automatic-reservation-itr/reserve';
import appRootPath from 'app-root-path';
import { type Page, executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';

(async () => {
  // Remove files in ss directory
  for (const file of fs.readdirSync(`${appRootPath.toString()}/src/ss`, { withFileTypes: true })) {
    if (file.isFile()) {
      fs.rmSync(`${appRootPath.toString()}/src/ss/${file.name}`);
    }
  }

  const args = process.argv.slice(2); // Get command line arguments
  const debug = args[1] === 'debug';
  const restaurant = args[0]; // Access the first argument
  if (!isRestaurant(restaurant)) {
    console.error(`Invalid restaurant name: ${restaurant}`);
    process.exit(1);
  }
  if (['alfaro', 'kotoritei'].includes(restaurant)) {
    console.error(`Under development: ${restaurant}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
  });
  const page: Page = await browser.newPage();

  try {
    await reserve(browser, page, restaurant, debug);
  } catch (e) {
    console.log('!!!!!!! error !!!!!!');
    console.error(e);
    await page.screenshot({
      path: `${appRootPath.toString()}/src/ss/999-error.png`,
      fullPage: true,
    });
  } finally {
    await browser.close();
  }
})();
