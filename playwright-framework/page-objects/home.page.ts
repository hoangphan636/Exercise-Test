import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1');
  }

  async goto() {
    await this.navigate('/');
  }

  async getHeadingText() {
    return await this.heading.innerText();
  }
}
