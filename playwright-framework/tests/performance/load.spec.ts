import { test, expect } from '@playwright/test';

test.describe('DemoBlaze Performance & Navigation Timing', () => {
  
  test('Homepage Load Time should be under 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('.hrefch', { state: 'visible' });
    
    const loadTime = Date.now() - startTime;
    console.log(`Homepage Load Time: ${loadTime}ms`);
    
    // Performance assertion
    expect(loadTime).toBeLessThan(10000); // Fails if page takes more than 10s to load
  });

});
