import { type Browser, executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';

let browser: Browser | null;
export async function getBrowser(_debug = false): Promise<Browser> {
  if (browser) {
    return Promise.resolve(browser);
  }
  const b = await puppeteer.launch({
    // headless: !debug,
    headless: true,
    executablePath: executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito'],
  });
  browser = b;

  return Promise.resolve(browser);
}
