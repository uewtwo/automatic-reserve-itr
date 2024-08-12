import '@automatic-reservation-itr/puppeteer-setup';
// import fs from 'node:fs';
import { isRestaurant } from '@automatic-reservation-itr/constants/Restaurant';
import { getBrowser } from '@automatic-reservation-itr/launchBrowser';
import { reserve } from '@automatic-reservation-itr/reserve';
import appRootPath from 'app-root-path';

(async () => {
  console.log('start');
  const args = process.argv.slice(2); // Get command line arguments
  const debug = args[1] === 'debug';
  // Remove files in ss directory
  // if (debug) {
  //   for (const file of fs.readdirSync(`${appRootPath.toString()}/src/ss`, {
  //     withFileTypes: true,
  //   })) {
  //     if (file.isFile()) {
  //       fs.rmSync(`${appRootPath.toString()}/src/ss/${file.name}`);
  //     }
  //   }
  // }

  const restaurant = args[0]; // Access the first argument
  if (!isRestaurant(restaurant)) {
    console.error(`Invalid restaurant name: ${restaurant}`);
    process.exit(1);
  }
  if (['alfaro', 'kotoritei'].includes(restaurant)) {
    console.error(`Under development: ${restaurant}`);
    process.exit(1);
  }
  console.log('restaurant:', restaurant);

  const browser = await getBrowser(debug);
  const page = await browser.newPage();

  try {
    await reserve(page, restaurant, debug);
  } catch (e) {
    console.log('!!!!!!! error !!!!!!');
    console.error(e);
    if (debug) {
      await page.screenshot({
        path: `${appRootPath.toString()}/ss/999-error.png`,
        fullPage: true,
      });
    }
  } finally {
    await browser.close();
  }
})();
