import { exchangeRateServerService } from "../src/services/exchangeRateServerService";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, "..");

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING EXCHANGERATE-API INTEGRATION TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Live USD -> INR Conversion
  try {
    console.log("\n[Test 1] Live USD -> INR Pair Conversion (100 USD)");
    const res1 = await exchangeRateServerService.convert({ from: "USD", to: "INR", amount: 100 });
    console.log("Response:", res1);
    assert(res1.success === true, "Conversion success is true");
    assert(res1.from === "USD" && res1.to === "INR", "From/To currencies match");
    assert(res1.rate > 50 && res1.rate < 150, `Rate is realistic live value (${res1.rate})`);
    assert(res1.convertedAmount > 5000, `Converted amount calculated correctly (${res1.convertedAmount})`);
  } catch (err: any) {
    console.error("Test 1 error:", err);
    assert(false, `Test 1 threw error: ${err?.message}`);
  }

  // 2. Live EUR -> USD Pair Conversion (50 EUR)
  try {
    console.log("\n[Test 2] Live EUR -> USD Pair Conversion (50 EUR)");
    const res2 = await exchangeRateServerService.convert({ from: "EUR", to: "USD", amount: 50 });
    console.log("Response:", res2);
    assert(res2.success === true, "Conversion success is true");
    assert(res2.rate > 0.5 && res2.rate < 2.0, `Rate is realistic live value (${res2.rate})`);
  } catch (err: any) {
    console.error("Test 2 error:", err);
    assert(false, `Test 2 threw error: ${err?.message}`);
  }

  // 3. Live Rates Fetch (Base USD)
  try {
    console.log("\n[Test 3] Live Latest Rates (Base USD)");
    const res3 = await exchangeRateServerService.getRates("USD");
    console.log("Fetched rates count:", Object.keys(res3.rates || {}).length);
    console.log("Sample rates (INR, EUR, GBP, AED):", {
      INR: res3.rates["INR"],
      EUR: res3.rates["EUR"],
      GBP: res3.rates["GBP"],
      AED: res3.rates["AED"],
    });
    assert(res3.success === true, "Latest rates success is true");
    assert(Boolean(res3.rates["INR"] && res3.rates["EUR"] && res3.rates["GBP"]), "Contains major currencies");
  } catch (err: any) {
    console.error("Test 3 error:", err);
    assert(false, `Test 3 threw error: ${err?.message}`);
  }

  // 4. Supported Codes Fetch
  try {
    console.log("\n[Test 4] Supported Currency Codes");
    const codes = await exchangeRateServerService.getSupportedCurrencies();
    console.log("Supported codes count:", codes.length);
    assert(codes.length > 10, "Has supported codes list");
    assert(codes.some((c) => c.code === "INR"), "Contains INR in supported codes");
  } catch (err: any) {
    console.error("Test 4 error:", err);
    assert(false, `Test 4 threw error: ${err?.message}`);
  }

  // 5. Validation: Negative Amount
  try {
    console.log("\n[Test 5] Validation: Negative Amount");
    await exchangeRateServerService.convert({ from: "USD", to: "INR", amount: -50 });
    assert(false, "Negative amount should have thrown validation error");
  } catch (err: any) {
    assert(err?.message.includes("greater than zero"), "Rejected negative amount with validation message");
  }

  // 6. Validation: Invalid Currency Code
  try {
    console.log("\n[Test 6] Validation: Invalid Currency Code (XYZ123)");
    await exchangeRateServerService.convert({ from: "XYZ123", to: "INR", amount: 100 });
    assert(false, "Invalid currency code should have thrown error");
  } catch (err: any) {
    assert(err?.message.includes("Invalid currency code"), "Rejected invalid code with validation message");
  }

  // 7. Client Bundle Security Check (Ensure API key is NOT leaked into dist/assets)
  console.log("\n[Test 7] Security: Verify API key is NOT exposed in client dist/");
  const distAssetsDir = path.join(appDir, "dist", "assets");
  const apiKey = process.env.EXCHANGE_RATE_API_KEY || "49a72d8afab5c38ce753142c";
  let keyFoundInClientBundle = false;

  if (fs.existsSync(distAssetsDir)) {
    const files = fs.readdirSync(distAssetsDir);
    for (const file of files) {
      if (file.endsWith(".js") || file.endsWith(".css")) {
        const content = fs.readFileSync(path.join(distAssetsDir, file), "utf-8");
        if (content.includes(apiKey)) {
          keyFoundInClientBundle = true;
          console.error(`⚠️ Security leak detected: API key found in ${file}`);
        }
      }
    }
  }

  assert(!keyFoundInClientBundle, "API Key is completely secure and NOT leaked into client JS bundles");

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
