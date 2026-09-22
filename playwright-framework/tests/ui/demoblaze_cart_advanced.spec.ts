import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/HomePage';
import { CartPage } from '../../page-objects/CartPage';

test.describe('DemoBlaze - Advanced Cart Test Plan (POM Refactored)', () => {

  let testUser: string;
  let testPass: string;

  test.beforeEach(async ({ page }) => {
    const timestamp = Date.now();
    testUser = `cartuser_${timestamp}`;
    testPass = `cartpass_${timestamp}`;

    const homePage = new HomePage(page);
    await homePage.goto();
    
    await homePage.signupNavButton.click();
    await page.locator('#signInModal').waitFor({ state: 'visible' });
    await page.fill('#sign-username', testUser);
    await page.fill('#sign-password', testPass);

    const signupDialogPromise = page.waitForEvent('dialog', { timeout: 5000 }).catch(() => null);
    await page.click('button:has-text("Sign up")');
    const signupDialog = await signupDialogPromise;
    if (signupDialog) await signupDialog.accept();
    
    await page.waitForTimeout(2000); 
    await page.reload(); 

    await homePage.login(testUser, testPass);
    await homePage.verifyLoggedIn(testUser);
  });

  test('Scenario 1: Add multiple products to the cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.selectProduct('Samsung galaxy s6');
    let dialogPromise = page.waitForEvent('dialog');
    await page.click('a:has-text("Add to cart")');
    let dialog = await dialogPromise;
    await dialog.accept();

    const entriesPromise = page.waitForResponse(res => res.url().includes('/entries'));
    await homePage.homeNavButton.click();
    await entriesPromise;
    await page.waitForTimeout(1000);

    await homePage.selectProduct('Nokia lumia 1520');
    dialogPromise = page.waitForEvent('dialog');
    await page.click('a:has-text("Add to cart")');
    dialog = await dialogPromise;
    await dialog.accept();

    await homePage.navigateToCart();

    await cartPage.verifyProductInCart('Samsung galaxy s6', '360');
    await cartPage.verifyProductInCart('Nokia lumia 1520', '820');
    await cartPage.verifyTotal('1180');
  });

  test('Scenario 2: Remove a product from the cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.selectProduct('Samsung galaxy s6');
    const dialogPromise = page.waitForEvent('dialog');
    await page.click('a:has-text("Add to cart")');
    const dialog = await dialogPromise;
    await dialog.accept();

    await homePage.navigateToCart();
    await cartPage.removeProduct('Samsung galaxy s6');
    await expect(cartPage.totalAmountLabel).not.toHaveText('360'); 
  });

  test('Scenario 3: Add the same product multiple times', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.selectProduct('Samsung galaxy s6');
    
    let dialogPromise = page.waitForEvent('dialog');
    await page.click('a:has-text("Add to cart")');
    let dialog = await dialogPromise;
    await dialog.accept();

    dialogPromise = page.waitForEvent('dialog');
    await page.click('a:has-text("Add to cart")');
    dialog = await dialogPromise;
    await dialog.accept();

    await homePage.navigateToCart();
    
    const rows = page.locator('.success', { hasText: 'Samsung galaxy s6' });
    await expect(rows).toHaveCount(2);
    
    for (let i = 0; i < 2; i++) {
      await expect(rows.nth(i).locator('td').nth(2)).toHaveText('360');
    }

    await cartPage.verifyTotal('720');
  });

  test('Scenario 4: Cart remains after navigation', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.selectProduct('Samsung galaxy s6');
    const dialogPromise = page.waitForEvent('dialog');
    await page.click('a:has-text("Add to cart")');
    const dialog = await dialogPromise;
    await dialog.accept();

    await homePage.navigateToCart();
    await cartPage.verifyProductInCart('Samsung galaxy s6', '360');

    await homePage.homeNavButton.click();
    await page.waitForSelector('a:has-text("Samsung galaxy s6")', { state: 'visible' });

    await homePage.navigateToCart();

    await cartPage.verifyProductInCart('Samsung galaxy s6', '360');
    await cartPage.verifyTotal('360');
  });

});
