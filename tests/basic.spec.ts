import { test, expect } from '@playwright/test';

const appUrl = 'http://localhost:5173';

test('has title', async ({ page }) => {
  await page.goto(appUrl);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Pool Hall Master/);
  const appTitle = page.getByText('South Dakota Billiards');
  await expect(appTitle).toBeVisible();
});
