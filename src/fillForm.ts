import { getBrowser } from '@automatic-reservation-itr/launchBrowser';
import { GotoPage } from '@automatic-reservation-itr/utils/GoToPage';
import appRootPath from 'app-root-path';
import type { Page } from 'puppeteer';

const AvailableStatuses = {
  OK: '○',
  ALMOST_FULL: '△',
  NG: '☓',
} as const;

const StartTimes = {
  '1900': '19:00~',
};

export async function fillForm(page: Page, dt: Date, debug: boolean) {
  await ss(page, 'page', debug);

  // 来店日の仮設定、毎月1日に動かす予定、+3ヶ月後の最初の日付
  const baseDate = new Date(dt);
  baseDate.setMonth(baseDate.getMonth() + 3);
  const targetMonth = `0${baseDate.getMonth() + 1}月`.slice(-3);
  const targetIndex = await page.evaluate(targetMonth => {
    const options = Array.from(
      document.querySelectorAll('#apply_join_time > option'),
    ) as HTMLElement[];
    return options.findIndex(el => el.innerText.includes(targetMonth));
  }, targetMonth);

  await page.evaluate(targetIndex => {
    const selectElement = document.querySelector('#apply_join_time') as HTMLSelectElement;
    console.log('selectElement', selectElement);
    console.log('typeof selectElement', typeof selectElement);
    selectElement.selectedIndex = targetIndex - 1;
  }, targetIndex);
  await ss(page, 'selected-date', debug);

  // 空き照会Window
  const browser = await getBrowser();
  const [availabilityPage, _] = await Promise.all([
    browser
      .waitForTarget(target => target.opener() === page.target())
      .then(target => target.page()),
    page.click('#showStatus'),
  ]);

  if (!availabilityPage) {
    throw new Error('availabilityPage is undefined');
  }
  await availabilityPage.waitForSelector('#nextWeek');

  await ss(availabilityPage, 'availabilityPage', debug);

  const tableRowSelector = 'div.tabContent > div.tabConBody > table.tb-calendar.mb10 > tbody > tr';
  // 時間テーブル取得
  const timeTable = await availabilityPage.$$(tableRowSelector);
  const timePerDay = await Promise.all(
    timeTable.map(async el => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      return await el.evaluate(e => (e.querySelector('td.time-row')! as HTMLElement).innerText);
    }),
  );
  const targetRangeIndex = timePerDay.findIndex(t => t.includes(StartTimes['1900']));

  // 空いてる時間帯のインデックス取得
  const targetTimes = timeTable[targetRangeIndex];
  const availableStatusIndexes = await targetTimes.evaluate((e, availables) => {
    const els = e.querySelectorAll('td');
    const statuses = Array.from(els).map((e, index) => {
      return { status: e.innerText, index };
    });

    return statuses
      .filter(s => s.status === availables.OK || s.status === availables.ALMOST_FULL)
      .toReversed();
  }, AvailableStatuses);
  // TODO: 空いてない場合にループする処理を追加
  // TODO: 空いてる時間探す→ない→次の週→空いてる時間探す(3回繰り返す)→空いてる時間なければエラー、通知

  // 空いてる時間帯のクリック&フォームページに戻る
  (await availabilityPage.$$(`${tableRowSelector}:nth-child(${targetRangeIndex}) > td`))[
    availableStatusIndexes[0].index
  ].click();
  await ss(page, 'formPage-selected-date', debug);
  // 利用人数入力
  await page.type('#apply_stay_persons', '3');
  // テーブル1卓選択
  await page.click('#apply_only_one_table_flag');

  const goto = new GotoPage(page);
  await goto.execute(page.click('input.button-select.button-primary'));
  await ss(page, '申し込み内容 確認ページ', debug);

  // 個人情報取扱ページへ遷移
  await goto.execute(page.click('#btn_next_page'));
  // メールアドレス入力ページへ遷移
  await goto.execute(page.click('input[value="同意する"]'));
  // メールアドレス入力
  await page.type('#email_inp', process.env.EMAIL as string);
  // ダイアログが出るので先にイベントハンドラを設定
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  await page.click('input[name="commit"]');
  await ss(page, 'メールアドレス入力完了', debug);
}

let count = 0;
async function ss(page: Page, name: string, debug: boolean) {
  if (!debug) {
    return;
  }
  count++;
  await page.screenshot({
    path: `${appRootPath.toString()}/ss/fillForm-${count}-${name}.png`,
  });
}
