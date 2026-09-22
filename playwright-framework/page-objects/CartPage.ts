import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly placeOrderButton: Locator;
  readonly totalAmountLabel: Locator;
  
  readonly checkoutNameInput: Locator;
  readonly checkoutCardInput: Locator;
  readonly checkoutPurchaseButton: Locator;
  readonly sweetAlertModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.placeOrderButton = page.locator('button:has-text("Place Order")');
    this.totalAmountLabel = page.locator('#totalp');
    
    this.checkoutNameInput = page.locator('#name');
    this.checkoutCardInput = page.locator('#card');
    this.checkoutPurchaseButton = page.locator('button:has-text("Purchase")');
    this.sweetAlertModal = page.locator('.sweet-alert');
  }

  async placeOrder(name: string, card: string) {
    await this.placeOrderButton.click();
    await this.checkoutNameInput.fill(name);
    await this.checkoutCardInput.fill(card);
    await this.checkoutPurchaseButton.click();
  }

  async verifyProductInCart(productName: string, expectedPrice: string) {
    const row = this.page.locator('.success', { hasText: productName }).first();
    await expect(row).toBeVisible();
    await expect(row.locator('td').nth(2)).toHaveText(expectedPrice);
  }

  async verifyTotal(expectedTotal: string) {
    await expect(this.totalAmountLabel).toHaveText(expectedTotal);
  }

  async removeProduct(productName: string) {
    const row = this.page.locator('.success', { hasText: productName }).first();
    await expect(row).toBeVisible();
    await row.locator('a:has-text("Delete")').click();
    await this.page.waitForTimeout(1500);
    await expect(row).not.toBeVisible();
  }
}
