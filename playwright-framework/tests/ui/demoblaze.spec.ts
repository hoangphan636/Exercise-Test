import { test, expect } from '@playwright/test';

// Generate a unique user for test isolation
const timestamp = Date.now();
const testUser = `user_${timestamp}`;
const testPass = `pass_${timestamp}`;

test.describe('DemoBlaze Test Suite V2', () => {
  
  test.beforeAll(async ({ browser }) => {
    // Create the unique user dynamically before the tests
    const page = await browser.newPage();
    await page.goto('https://www.demoblaze.com/');
    


    await page.click('#signin2');
    await page.locator('#signInModal').waitFor({ state: 'visible' });
    await page.fill('#sign-username', testUser);
    await page.fill('#sign-password', testPass);
    const signupDialogPromise = page.waitForEvent('dialog', { timeout: 10000 }).catch(() => null);
    await page.click('button:has-text("Sign up")');
    const signupDialog = await signupDialogPromise;
    if (signupDialog) await signupDialog.accept();
    await page.waitForTimeout(1000);
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.demoblaze.com/');
  });

  test.describe('Authentication & Login Validation', () => {

    test('TC-LOGIN-001: Successful Login with Valid Credentials', async ({ page }) => {
      await page.click('#login2');
      await page.locator('#logInModal').waitFor({ state: 'visible' });
      await page.fill('#loginusername', testUser);
      await page.fill('#loginpassword', testPass);
      const loginResponse = page.waitForResponse(res => res.url().includes('/login'));
      await page.click('button:has-text("Log in")');
      await loginResponse;

      // Assert welcome message
      await expect(page.locator('#nameofuser')).toContainText(`Welcome ${testUser}`);
    });

    test('TC-LOGIN-002: Login with Invalid Password', async ({ page }) => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Wrong password.');
        await dialog.accept();
      });

      await page.click('#login2');
      await page.fill('#loginusername', testUser);
      await page.fill('#loginpassword', 'wrongpassword');
      await page.click('button:has-text("Log in")');
      
      // Wait to ensure dialog handler is triggered
      await page.waitForTimeout(1000);
    });

    test('TC-LOGIN-003: Login with Non-existent User', async ({ page }) => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('User does not exist.');
        await dialog.accept();
      });

      await page.click('#login2');
      await page.fill('#loginusername', 'nonexistent_user_999999');
      await page.fill('#loginpassword', 'anypass');
      await page.click('button:has-text("Log in")');
      
      await page.waitForTimeout(1000);
    });

    test('TC-LOGIN-004: Login with both fields empty', async ({ page }) => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Please fill out Username and Password.');
        await dialog.accept();
      });

      await page.click('#login2');
      await page.click('button:has-text("Log in")');
      
      await page.waitForTimeout(1000);
    });

    test('TC-LOGIN-005: Login with empty username, valid password', async ({ page }) => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Please fill out Username and Password.');
        await dialog.accept();
      });

      await page.click('#login2');
      await page.fill('#loginpassword', testPass);
      await page.click('button:has-text("Log in")');
      
      await page.waitForTimeout(1000);
    });

    test('TC-LOGIN-006: Login with valid username, empty password', async ({ page }) => {
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Please fill out Username and Password.');
        await dialog.accept();
      });

      await page.click('#login2');
      await page.fill('#loginusername', testUser);
      await page.click('button:has-text("Log in")');
      
      await page.waitForTimeout(1000);
    });

  });

  test.describe('Cart & Order Validation', () => {

    test('TC-CART-001: Add Single Product and Place Order Successfully', async ({ page }) => {
      // Login first
      await page.click('#login2');
      await page.locator('#logInModal').waitFor({ state: 'visible' });
      await page.fill('#loginusername', testUser);
      await page.fill('#loginpassword', testPass);
      const loginResponse = page.waitForResponse(res => res.url().includes('/login'));
      await page.click('button:has-text("Log in")');
      await loginResponse;
      await expect(page.locator('#nameofuser')).toContainText(`Welcome ${testUser}`);

      // Add "Samsung galaxy s6" which costs 360 USD
      await page.click('a:has-text("Samsung galaxy s6")');
      
      const dialogPromise = page.waitForEvent('dialog');
      await page.click('a:has-text("Add to cart")');
      const dialog = await dialogPromise;
      expect(dialog.message()).toBe('Product added.');
      await dialog.accept();

      // Navigate to cart and wait for /viewcart API to resolve network flakiness
      const viewCartPromise = page.waitForResponse(response => 
        response.url().includes('/viewcart') && response.status() === 200
      );
      await page.click('#cartur');
      await viewCartPromise;

      // Place Order
      await page.click('button:has-text("Place Order")');
      await page.fill('#name', 'Test Buyer');
      await page.fill('#card', '1234567890123456');
      await page.click('button:has-text("Purchase")');

      // Assert SweetAlert appears and contains 360 USD
      const sweetAlert = page.locator('.sweet-alert');
      await expect(sweetAlert).toBeVisible();
      await expect(page.locator('.sweet-alert p.lead')).toContainText('360 USD');
    });

    test('TC-CART-002: Place Order with Missing Name Field', async ({ page }) => {
      const viewCartPromise = page.waitForResponse(response => 
        response.url().includes('/viewcart') && response.status() === 200
      );
      await page.click('#cartur');
      await viewCartPromise;

      await page.click('button:has-text("Place Order")');
      
      // Leave Name empty, fill Card
      await page.fill('#card', '1234567890123456');

      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Please fill out Name and Creditcard.');
        await dialog.accept();
      });

      await page.click('button:has-text("Purchase")');
      await page.waitForTimeout(1000);
    });

    test('TC-CART-003: Place Order with Missing Credit Card Field', async ({ page }) => {
      const viewCartPromise = page.waitForResponse(response => 
        response.url().includes('/viewcart') && response.status() === 200
      );
      await page.click('#cartur');
      await viewCartPromise;

      await page.click('button:has-text("Place Order")');
      
      // Fill Name, leave Card empty
      await page.fill('#name', 'Test Buyer');

      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Please fill out Name and Creditcard.');
        await dialog.accept();
      });

      await page.click('button:has-text("Purchase")');
      await page.waitForTimeout(1000);
    });

    test('TC-CART-004: Place Order with an Empty Cart', async ({ page }) => {
      test.fail(true, 'DemoBlaze has a bug that allows 0 USD purchases');
      
      // Ensure cart is empty by not adding anything or logging into a fresh user
      const viewCartPromise = page.waitForResponse(response => 
        response.url().includes('/viewcart') && response.status() === 200
      );
      await page.click('#cartur');
      await viewCartPromise;

      await page.click('button:has-text("Place Order")');
      await page.fill('#name', 'Test Buyer');
      await page.fill('#card', '1234567890123456');
      await page.click('button:has-text("Purchase")');

      // The expectation is that the application should block purchasing an empty cart.
      // E.g., The sweet alert should NOT be visible, or an error should appear.
      // However, Demoblaze allows it, thus the test should fail on the assertion below.
      const sweetAlert = page.locator('.sweet-alert');
      await expect(sweetAlert).not.toBeVisible();
    });

  });

});
