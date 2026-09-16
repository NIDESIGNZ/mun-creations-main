// Comprehensive Automated Lifecycle Test for Mun Creations CMS ↔ Storefront Synchronization
const BASE_URL = "http://localhost:5173";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ ${message}`);
}

async function runTest() {
  console.log("==================================================");
  console.log("MUN CREATIONS CMS ↔ STOREFRONT SYNCHRONIZATION TEST");
  console.log("==================================================\n");

  // 1. Health & Cache-Control Check
  console.log("STEP 1: Checking API Health & Cache-Control Headers...");
  const pubProductsRes = await fetch(`${BASE_URL}/api/products`);
  assert(pubProductsRes.ok, "Public /api/products returns HTTP 200");
  const cacheControl = pubProductsRes.headers.get("cache-control");
  assert(
    cacheControl && cacheControl.includes("no-store") && cacheControl.includes("no-cache"),
    `Cache-Control header is non-stale: "${cacheControl}"`
  );

  // 2. Admin Authentication
  console.log("\nSTEP 2: Authenticating as Admin...");
  const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "mun@dev1234" }),
  });
  const loginData = await loginRes.json();
  assert(loginData.success && Boolean(loginData.token), "Admin login successful and token received");
  const token = loginData.token;
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // 3. Create Product X
  console.log("\nSTEP 3: Creating Product X (Draft initially)...");
  const testSku = `SYNC-TEST-${Date.now()}`;
  const productXData = {
    name: "Sync Test Saree X",
    sku: testSku,
    category: "Banarasi",
    subcategory: "Katan Silk",
    fabric: "Pure Katan Silk",
    color: "Imperial Ruby Red",
    priceUsd: 350,
    priceInr: 29225,
    stockQuantity: 5,
    active: true,
    published: false, // Start as unpublished draft
    status: "draft",
    image: "/images/products/hero-saree.webp",
    description: "Product X for testing strict single-source synchronization.",
  };

  const createRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(productXData),
  });
  const createJson = await createRes.json();
  assert(createJson.success && createJson.product, "Product X successfully created in CMS database");
  const productX = createJson.product;
  const productId = productX.id;
  const productSlug = productX.slug;
  console.log(`Created Product X: ID="${productId}", SKU="${testSku}", Slug="${productSlug}"`);

  // 4. Verify Draft Product X does NOT appear on storefront
  console.log("\nSTEP 4: Verifying Draft Product X is HIDDEN from public storefront...");
  let storeRes = await fetch(`${BASE_URL}/api/products`);
  let storeProducts = await storeRes.json();
  assert(
    !storeProducts.some((p) => p.id === productId || p.sku === testSku),
    "Draft Product X does NOT appear in public storefront product list"
  );

  let singleRes = await fetch(`${BASE_URL}/api/products/${encodeURIComponent(productId)}`);
  assert(singleRes.status === 404, "Draft Product X returns 404 on public /api/products/:id");

  let slugRes = await fetch(`${BASE_URL}/api/products/slug/${encodeURIComponent(productSlug)}`);
  assert(slugRes.status === 404, "Draft Product X returns 404 on public /api/products/slug/:slug");

  // 5. Publish Product X
  console.log("\nSTEP 5: Publishing Product X via CMS...");
  const pubActionRes = await fetch(`${BASE_URL}/api/admin/products/${encodeURIComponent(productId)}/publish`, {
    method: "POST",
    headers: authHeaders,
  });
  const pubActionJson = await pubActionRes.json();
  assert(pubActionJson.success && pubActionJson.product.published === true, "Product X published in CMS");

  // 6. Verify Storefront immediately shows Product X
  console.log("\nSTEP 6: Verifying Product X is LIVE on storefront...");
  storeRes = await fetch(`${BASE_URL}/api/products`);
  storeProducts = await storeRes.json();
  const foundLive = storeProducts.find((p) => p.id === productId || p.sku === testSku);
  assert(Boolean(foundLive), "Published Product X immediately appears in public storefront listing");
  assert(foundLive.priceUsd === 350, "Storefront reflects initial price of $350");

  singleRes = await fetch(`${BASE_URL}/api/products/${encodeURIComponent(productId)}`);
  assert(singleRes.ok, "Public /api/products/:id returns HTTP 200 for live Product X");

  slugRes = await fetch(`${BASE_URL}/api/products/slug/${encodeURIComponent(productSlug)}`);
  assert(slugRes.ok, "Public /api/products/slug/:slug returns HTTP 200 for live Product X");

  // 7. Edit Product X: Name, Price $350 -> $400, Stock 5 -> 10
  console.log("\nSTEP 7: Editing Product X in CMS (Price $350 -> $400, Stock 5 -> 10, Updated Name)...");
  const editRes = await fetch(`${BASE_URL}/api/admin/products/${encodeURIComponent(productId)}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({
      name: "Sync Test Saree X Updated",
      priceUsd: 400,
      price: 400,
      stockQuantity: 10,
      stock: 10,
    }),
  });
  const editJson = await editRes.json();
  assert(editJson.success && editJson.product.priceUsd === 400, "CMS updated price to $400 and stock to 10");

  // 8. Verify Storefront reflects edited values
  console.log("\nSTEP 8: Verifying Storefront immediately reflects edited price ($400) and stock (10)...");
  singleRes = await fetch(`${BASE_URL}/api/products/${encodeURIComponent(productId)}`);
  const updatedSingle = await singleRes.json();
  assert(updatedSingle.priceUsd === 400, `Storefront single product reflects updated price: $${updatedSingle.priceUsd}`);
  assert(updatedSingle.stockQuantity === 10, `Storefront single product reflects updated stock: ${updatedSingle.stockQuantity}`);
  assert(updatedSingle.name === "Sync Test Saree X Updated", `Storefront single product reflects updated name: "${updatedSingle.name}"`);

  // 9. Unpublish Product X
  console.log("\nSTEP 9: Unpublishing Product X via CMS...");
  const unpubRes = await fetch(`${BASE_URL}/api/admin/products/${encodeURIComponent(productId)}/unpublish`, {
    method: "POST",
    headers: authHeaders,
  });
  const unpubJson = await unpubRes.json();
  assert(unpubJson.success && unpubJson.product.published === false, "CMS successfully set published = false");

  storeRes = await fetch(`${BASE_URL}/api/products`);
  storeProducts = await storeRes.json();
  assert(!storeProducts.some((p) => p.id === productId), "Unpublished Product X disappeared from storefront listing");

  singleRes = await fetch(`${BASE_URL}/api/products/${encodeURIComponent(productId)}`);
  assert(singleRes.status === 404, "Unpublished Product X returns 404 on public /api/products/:id");

  // 10. Delete / Archive Product X
  console.log("\nSTEP 10: Soft Deleting / Archiving Product X via CMS...");
  const deleteRes = await fetch(`${BASE_URL}/api/admin/products/${encodeURIComponent(productId)}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  const deleteJson = await deleteRes.json();
  assert(deleteJson.success, "CMS confirmed product deletion/archive");

  // 11. Verify Storefront after deletion
  console.log("\nSTEP 11: Verifying Storefront after deletion/archive...");
  storeRes = await fetch(`${BASE_URL}/api/products`);
  storeProducts = await storeRes.json();
  assert(!storeProducts.some((p) => p.id === productId), "Deleted Product X does NOT appear in public storefront");

  singleRes = await fetch(`${BASE_URL}/api/products/${encodeURIComponent(productId)}`);
  assert(singleRes.status === 404, "Deleted Product X returns 404 on /api/products/:id");

  slugRes = await fetch(`${BASE_URL}/api/products/slug/${encodeURIComponent(productSlug)}`);
  assert(slugRes.status === 404, "Deleted Product X returns 404 on /api/products/slug/:slug");

  // 12. Search check: searching for SKU must yield 0 results
  console.log("\nSTEP 12: Testing Public Search for deleted product...");
  const searchRes = await fetch(`${BASE_URL}/api/products?search=${encodeURIComponent(testSku)}`);
  const searchProducts = await searchRes.json();
  assert(searchProducts.length === 0, `Search for deleted SKU "${testSku}" returned 0 results`);

  // 13. Cart & Razorpay Checkout Rejection Safety Check
  console.log("\nSTEP 13: Testing Cart & Checkout Order Safety for deleted product...");
  // Attempt to create a Razorpay order containing the deleted/archived Product X
  const orderRes = await fetch(`${BASE_URL}/api/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{ productId: productId, quantity: 1 }],
      currency: "INR",
      receipt: `rcpt_test_${Date.now()}`,
    }),
  });
  const orderJson = await orderRes.json();
  assert(
    !orderRes.ok && orderRes.status === 404,
    `Order creation for deleted Product X was authoritatively REJECTED (HTTP ${orderRes.status}: ${orderJson.error})`
  );

  // Attempt cart valuation calculation for deleted Product X
  const cartRes = await fetch(`${BASE_URL}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{ productId: productId, quantity: 1 }],
    }),
  });
  const cartJson = await cartRes.json();
  assert(
    !cartRes.ok && cartJson.success === false,
    `Cart valuation for deleted Product X was authoritatively REJECTED (${cartJson.error})`
  );

  console.log("\n==================================================");
  console.log("🎉 ALL SYNCHRONIZATION & SAFETY ACCEPTANCE TESTS PASSED!");
  console.log("==================================================");
}

runTest().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
