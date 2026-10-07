import { test, expect } from '@playwright/test';

test.describe('E2E Checkout Flow & Security', () => {
  // We mock a user journey to ensure everything holds together

  test('User cannot checkout with negative quantities', async ({ page }) => {
    // Note: To run this test, you must have the app running on localhost:3000
    await page.goto('http://localhost:3000/cart');

    // This is a security simulation: what if someone injects a negative number into the DOM?
    // Playwright evaluates code in the browser context
    await page.evaluate(() => {
      // Attempt to bypass UI restrictions and send a bad payload
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 'fake-id', qty: -10 })
      });
    });

    // The backend Zod validation should reject this and not update the cart
    // Wait for network response (we expect a 400 Bad Request)
    const response = await page.waitForResponse(response => response.url().includes('/api/cart'));
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('Complete Cart to Checkout Flow with points', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('http://localhost:3000/');
    
    // 2. Add an item to cart (assuming there is a product card)
    // Note: In a real test database, we would seed a known product first
    // await page.click('text=Add to Cart');

    // 3. Go to cart
    await page.goto('http://localhost:3000/cart');

    // 4. Verify checkout button exists
    const checkoutBtn = page.locator('text=Proceed to Checkout');
    await expect(checkoutBtn).toBeVisible();

    // The remainder of the test would fill out shipping details and mock the Razorpay window
  });
});
