import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly loginNavButton: Locator;
  readonly signupNavButton: Locator;
  readonly cartNavButton: Locator;
  readonly homeNavButton: Locator;
  readonly welcomeUserLabel: Locator;
  
  readonly loginModal: Locator;
  readonly loginUsernameInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginNavButton = page.locator('#login2');
    this.signupNavButton = page.locator('#signin2');
    this.cartNavButton = page.locator('#cartur');
    this.homeNavButton = page.locator('li.nav-item a.nav-link[href="index.html"]');
    this.welcomeUserLabel = page.locator('#nameofuser');
    
    this.loginModal = page.locator('#logInModal');
    this.loginUsernameInput = page.locator('#loginusername');
    this.loginPasswordInput = page.locator('#loginpassword');
    this.loginSubmitButton = page.locator('button:has-text("Log in")');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.loginNavButton.click();
    await this.loginModal.waitFor({ state: 'visible' });
    await this.loginUsernameInput.fill(username);
    await this.loginPasswordInput.fill(password);
    
    const loginResponse = this.page.waitForResponse(res => res.url().includes('/login'));
    await this.loginSubmitButton.click();
    await loginResponse;
  }

  async verifyLoggedIn(username: string) {
    await expect(this.welcomeUserLabel).toContainText(`Welcome ${username}`);
  }

  async selectProduct(productName: string) {
    const viewPromise = this.page.waitForResponse(res => res.url().includes('/view') && res.status() === 200);
    await this.page.locator(`a:has-text("${productName}")`).click();
    await viewPromise;
    await this.page.waitForSelector('a:has-text("Add to cart")', { state: 'visible' });
  }

  async navigateToCart() {
    const viewCartPromise = this.page.waitForResponse(response => 
      response.url().includes('/viewcart') && response.status() === 200
    );
    await this.cartNavButton.click();
    await viewCartPromise;
  }
}
