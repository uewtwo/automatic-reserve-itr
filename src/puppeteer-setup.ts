import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';

puppeteer.use(StealthPlugin());
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: process.env.CAPTCHA_API_KEY,
      // token: 'token',
    },
    visualFeedback: true,
  }),
);

console.log('puppeteer-setup.ts, email', process.env.EMAIL);
