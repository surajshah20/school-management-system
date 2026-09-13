import { test, expect } from '@playwright/test';

test('admin user can successfully log in and see dashboard', async ({ page }) => {
  // 1. Go to the frontend login page
  await page.goto('http://localhost:5173/');

  // 2. Type in the Admin Identifier
  await page.fill('input[placeholder="e.g. ADM-2026-001"]', 'ADM-2026-001');

  // 3. Type in the Password
  await page.fill('input[placeholder="Enter your password"]', 'SecurePassword123');

  // 4. Click the "Sign In" button
  await page.click('button:has-text("Sign In")');

  // 5. Assert that the dashboard success message appears!
  const successMessage = page.locator('text=You made it to the Dashboard!');
  await expect(successMessage).toBeVisible();
  
  // 6. Assert that the URL changed to /dashboard
  await expect(page).toHaveURL(/.*dashboard/);
});