import { test, expect } from '@playwright/test';

test('plays five turns', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const input = page.getByLabel('Action or dialogue');
  for (let i = 0; i < 5; i++) {
    await input.fill(`Turn ${i + 1}`);
    await page.getByRole('button', { name: 'Resolve' }).click();
  }
  const logs = await page.locator('main section[aria-label="Narration"] p').allTextContents();
  expect(logs.length).toBeGreaterThanOrEqual(5);
});