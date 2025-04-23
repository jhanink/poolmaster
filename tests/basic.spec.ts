import { test, expect } from '@playwright/test';

const appUrl = 'http://localhost:5173';

test('has title', async ({ page }) => {
  await page.goto(appUrl);

  await expect(page).toHaveTitle(/Pool Hall Master/);
  const defaultVenueName = page.getByText('South Dakota Billiards');
  await expect(defaultVenueName).toBeVisible();
});
