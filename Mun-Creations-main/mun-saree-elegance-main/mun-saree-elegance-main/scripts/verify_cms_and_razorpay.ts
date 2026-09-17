import { contentDatabase } from "../src/lib/server/contentDatabase";
import { productDatabase } from "../src/lib/server/productDatabase";
import { razorpayService } from "../src/services/razorpayService";

async function run() {
  console.log("--- 1. Testing CMS Content Database ---");
  const content = contentDatabase.getContent();
  console.log("Homepage SEO:", content.homepage.seoTitle);
  console.log("About Header:", content.about.title);
  console.log("Categories Loaded:", Object.keys(content.categories).join(", "));
  console.log("FAQs Count:", content.faqs.length);
  console.log("Returns WhatsApp:", content.returns.whatsappNumber);
  console.log("Footer WhatsApp:", content.footer.whatsappNumber);

  console.log("\n--- 2. Testing Razorpay Create Order with Valid Catalog Product ---");
  const publicProducts = productDatabase.getPublicProducts().products;
  if (publicProducts.length === 0) {
    console.error("No public products found in database!");
    process.exit(1);
  }

  const sampleProduct = publicProducts[0];
  console.log(`Using sample product: "${sampleProduct.name}" (ID: ${sampleProduct.id})`);

  try {
    const order = await razorpayService.createOrder({
      items: [{ id: sampleProduct.id, name: sampleProduct.name, priceUsd: sampleProduct.priceUsd, quantity: 1 }],
      shippingMethod: "standard",
      currency: "INR",
    });
    console.log("Razorpay Order Created Successfully!");
    console.log("Order ID:", order.order_id);
    console.log("Currency:", order.currency);
    console.log("Amount (paise):", order.amount);
    console.log("Key ID present:", Boolean(order.key_id));
  } catch (err) {
    console.error("Razorpay Order Creation Failed:", err);
    process.exit(1);
  }

  console.log("\n--- All Verification Checks Passed! ---");
}

run();
