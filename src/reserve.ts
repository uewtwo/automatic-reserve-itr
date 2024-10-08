import { setTimeout } from 'node:timers/promises';
import {
  type Restaurant,
  Restaurants,
  ServiceIndexByRestaurant,
} from '@automatic-reservation-itr/constants/Restaurant';
import { fillForm } from '@automatic-reservation-itr/fillForm';
import { GotoPage } from '@automatic-reservation-itr/utils/GoToPage';
import type { Page } from 'puppeteer';

export async function reserve(page: Page, restaurant: Restaurant, debug = false) {
  const dt = new Date();
  // スタート・リストページ
  await page.goto('https://as.its-kenpo.or.jp/service_category/index', {
    waitUntil: 'domcontentloaded',
  });
  const gotoPageExecutor = new GotoPage(page);
  console.log('page', page.url());

  // レストラン一覧ページ
  await gotoPageExecutor.execute(
    page.click(
      '#container > div.request-box > div > section > div:nth-child(12) > div:nth-child(1) > a',
    ),
    debug ? { name: 'gotoRestaurantListPage' } : undefined,
  );
  console.log('page', page.url());
  // pre: レストラン選択ページ
  // post: 時間選択ページへ遷移
  await gotoPageExecutor.execute(
    page
      .$$('#container > section > form > div.clearfix.mt20 > section.one_third > div > a')
      .then(els => els[Restaurants[restaurant]].click()),
    debug ? { name: 'gotoTargetRestaurantPage' } : undefined,
  );
  console.log('page', page.url());
  // 時間選択、レストランによって選択肢を変える
  // 認証ページへ遷移
  await gotoPageExecutor.execute(
    page.click(
      `#container > section > ul > li:nth-child(${ServiceIndexByRestaurant[restaurant]}) > a`,
    ),
    debug ? { name: 'gotoAvailableSeats' } : undefined,
  );

  // solve reCAPTCHA
  const resolved = await page.solveRecaptchas();
  console.log('resolved', resolved);
  await setTimeout(3000);
  console.log('page', page.url());
  // reCAPTCHAページ
  await gotoPageExecutor.execute(
    page.$('#new_apply > div > input').then(el => el?.click()),
    debug ? { name: 'afterRecaptchaPassed' } : undefined,
  );
  console.log('page', page.url());
  // 申し込みフォーム入力してメールアドレス送信まで
  // TODO: 申し込みフォーム終えて元のpage戻ってきたら、その先はこの関数で処理する
  await fillForm(page, dt, debug);
}
