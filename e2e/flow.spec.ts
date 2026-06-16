import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

/**
 * Visual smoke flow for GroupWise on a simulated iPhone.
 *
 * Drives the core journey (create group → add members → generate rounds →
 * complete a group) and captures full-page screenshots at each step so the
 * mobile UX can be reviewed and compared before/after changes.
 *
 * Screenshots are written to e2e/__screenshots__/ (gitignored). Override the
 * destination with SHOTS_DIR to keep separate "before"/"after" sets, e.g.:
 *   SHOTS_DIR=e2e/__screenshots__/after npx playwright test
 */
const SHOTS_DIR = process.env.SHOTS_DIR
  ? path.resolve(process.env.SHOTS_DIR)
  : path.join(__dirname, '__screenshots__');

const shot = (name: string) => path.join(SHOTS_DIR, name);

const MEMBERS = ['Alice', 'Bob', 'Carol', 'Dave', 'Erin'];

/**
 * Load the app with a clean slate and freeze animations so screenshots
 * capture settled, final states rather than mid-transition frames.
 */
async function freshStart(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }`,
  });
}

test('mobile core flow', async ({ page }) => {
  await freshStart(page);

  // 1. Home, empty state.
  await expect(
    page.getByRole('button', { name: /Create New Group/i }),
  ).toBeVisible();
  await page.screenshot({ path: shot('01-home-empty.png'), fullPage: true });

  // 2. Open the create-group form.
  await page.getByRole('button', { name: /Create New Group/i }).click();
  const nameInput = page.getByPlaceholder('Enter a group name...');
  await expect(nameInput).toBeVisible();
  await nameInput.fill('Design Team');
  await page.screenshot({ path: shot('02-create-form.png'), fullPage: true });

  // 3. Create the group → lands on the detail view.
  await page.getByRole('button', { name: 'Create Group' }).click();
  await expect(
    page.getByRole('heading', { name: 'Design Team' }),
  ).toBeVisible();

  // 4. Add members.
  const memberInput = page.getByPlaceholder('Enter member name...');
  for (const member of MEMBERS) {
    await memberInput.fill(member);
    await memberInput.press('Enter');
    await expect(page.getByText(member, { exact: true })).toBeVisible();
  }
  await page.screenshot({ path: shot('03-detail-members.png'), fullPage: true });

  // 5. Generate rotation rounds (default mode, pairs).
  await page.getByRole('button', { name: /Generate Pairs/i }).click();
  await expect(page.getByText('Round 1', { exact: true })).toBeVisible();
  await page.screenshot({ path: shot('04-generated-rounds.png'), fullPage: true });

  // 6. Mark the first group complete.
  await page.getByText('Group 1', { exact: true }).first().click();
  await page.screenshot({ path: shot('05-completed-toggle.png'), fullPage: true });

  // 7. The nav bar stays pinned to the top while scrolling a long page.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator('.nav-bar')).toBeInViewport();
  await page.screenshot({ path: shot('07-scrolled-nav.png') });
});

test('delete confirmation modal', async ({ page }) => {
  await freshStart(page);

  await page.getByRole('button', { name: /Create New Group/i }).click();
  await page.getByPlaceholder('Enter a group name...').fill('Temp Team');
  await page.getByRole('button', { name: 'Create Group' }).click();
  await expect(page.getByRole('heading', { name: 'Temp Team' })).toBeVisible();

  // Open the destructive confirm dialog (trash icon in the nav bar).
  await page.locator('.nav-bar button').last().click();
  await expect(page.getByText(/Are you sure you want to delete/i)).toBeVisible();
  await page.screenshot({ path: shot('06-delete-modal.png'), fullPage: true });
});
