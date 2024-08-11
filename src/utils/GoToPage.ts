import type { PageOrder } from '@automatic-reservation-itr/constants/PageOrder';
import appRootPath from 'app-root-path';
import type { Page } from 'puppeteer';

export class GotoPage {
  ssCounter: number;
  constructor(readonly page: Page) {
    this.page = page;
    this.ssCounter = 0;
  }

  async execute(
    action: Promise<unknown>,
    debug?: {
      name: PageOrder;
    }
  ) {
    await Promise.all([this.page.waitForNavigation(), action]);
    if (debug) {
      await this.saveSSWithFunction(debug.name);
    }
  }

  private async saveSSWithFunction(name: string) {
    this.ssCounter++;
    await this.page.screenshot({
      path: `${appRootPath.toString()}/ss/${this.ssCounter}-${name}.png`,
      fullPage: true,
    });
  }
}
