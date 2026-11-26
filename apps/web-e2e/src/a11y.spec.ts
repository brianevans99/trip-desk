import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mockApi } from './support/mock-api';

const routes = [
  { name: 'Destinations', path: '/' },
  { name: 'Destination detail', path: '/destinations/lisbon' },
  { name: 'Itineraries (signed out)', path: '/itineraries' },
];

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

for (const r of routes) {
  test.describe(r.name, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(r.path);
      // Wait until the skeleton (role="status") is gone, so we test the real page
      await expect(page.getByRole('status')).toHaveCount(0);
    });

    test('has exactly one h1', async ({ page }) => {
      await expect(page.locator('h1')).toHaveCount(1);
    });

    test('has no WCAG A/AA violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const summary = results.violations.map(
        (v) => `${v.id}: ${v.help} (${v.nodes.length} element${v.nodes.length === 1 ? '' : 's'})`,
      );
      expect(summary).toEqual([]);
    });
  });
}
