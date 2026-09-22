import { test, expect } from '@playwright/test';

test.describe('DemoBlaze API Automation', () => {
  const apiBase = process.env.API_URL || 'https://api.demoblaze.com';

  test('GET /entries - Fetch products list', async ({ request }) => {
    const response = await request.get(`${apiBase}/entries`);
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.Items.length).toBeGreaterThan(0);
    expect(body.Items[0]).toHaveProperty('title');
    expect(body.Items[0]).toHaveProperty('price');
  });

  test('POST /login - Validate incorrect login', async ({ request }) => {
    const response = await request.post(`${apiBase}/login`, {
      data: {
        username: 'nonexistent_user',
        password: 'wrongpassword'
      }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.errorMessage).toBe('User does not exist.');
  });
});
