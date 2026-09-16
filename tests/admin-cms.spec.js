const { test, expect } = require("@playwright/test");
const path = require("path");

const ARTIFACTS_DIR = "C:/Users/jackn/.gemini/antigravity-ide/brain/5a1b6711-137a-46d6-83eb-286f4be6a746";

test("Admin Master PMS & Storefront Flow", async ({ page }) => {
  // 1. Navigate to Admin
  await page.goto("http://localhost:5173/admin");
  await expect(page).toHaveTitle(/Enterprise|Admin|PMS/i);

  // 2. Sign In
  const passwordInput = page.locator('input[type="password"]');
  if (await passwordInput.isVisible()) {
    await passwordInput.fill("mun@dev1234");
    await page.click('button[type="submit"]');
  }

  // 3. Verify Admin Dashboard
  await expect(page.locator("text=Master PMS Control Dashboard")).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "admin_dashboard.png") });

  // 4. Click Product Catalog
  await page.click("text=2. Product Catalog");
  await expect(page.locator("text=Master Product Catalog")).toBeVisible({ timeout: 5000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "admin_catalog.png") });

  // 5. Open Add Saree Modal
  await page.click("text=Add Saree");
  await expect(page.locator("text=Section 1: Basic Information")).toBeVisible({ timeout: 5000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "admin_editor_modal.png") });

  // Close modal
  await page.click("text=Cancel");

  // 6. Navigate to Storefront Products
  await page.goto("http://localhost:5173/products");
  await expect(page.getByRole("heading", { name: "All Handcrafted Sarees & Ensembles" })).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "storefront_products.png") });
});
