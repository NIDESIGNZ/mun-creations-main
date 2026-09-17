export interface HomepageCategoryItem {
  slug: string;
  name: string;
  description: string;
}

export interface HomepageContent {
  seoTitle: string;
  metaDescription: string;
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    cta2Text: string;
    cta2Link: string;
  };
  brandIntro: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
  };
  categorySection: {
    title: string;
    subtitle: string;
    items: HomepageCategoryItem[];
  };
  brandStory: {
    eyebrow: string;
    title: string;
    body: string;
  };
  trustSection: {
    title: string;
    items: string[];
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export interface AboutContent {
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  introP1: string;
  introP2: string;
  introP3: string;
  philosophy: {
    title: string;
    subtitle: string;
    description: string;
    styles: string[];
  };
  promise: {
    title: string;
    description: string;
  };
}

export interface CategoryPageItem {
  seoTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  description: string;
  shopByList?: string[];
  perfectFor?: string[];
  closing?: string;
  designedFor?: string[];
}

export interface CategoriesContent {
  sarees: CategoryPageItem;
  banarasi: CategoryPageItem;
  tussar: CategoryPageItem;
  kanjivaram: CategoryPageItem;
  designer: CategoryPageItem;
  handloom: CategoryPageItem;
  "wedding-festive": CategoryPageItem;
  [key: string]: CategoryPageItem;
}

export interface ShippingContent {
  seoTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  intro: string;
  orderProcessingTitle: string;
  orderProcessingBody: string;
  internationalShippingTitle: string;
  internationalShippingBody: string;
  importantTitle: string;
  importantBody: string;
  whatsappNumber: string;
  whatsappUrl: string;
}

export interface ReturnsContent {
  seoTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  body: string;
  buttonText: string;
  whatsappNumber: string;
  whatsappUrl: string;
  note: string;
}

export interface ContactContent {
  seoTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  body: string;
  whatsappNumber: string;
  whatsappUrl: string;
  productEnquiriesTitle: string;
  productEnquiriesBody: string;
  orderAssistanceTitle: string;
  orderAssistanceBody: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PrivacyContent {
  seoTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  intro: string;
  collectionIntro: string;
  collectionPoints: string[];
  typesIntro: string;
  typesPoints: string[];
  paymentNote: string;
  usageIntro: string;
  usagePoints: string[];
  legalReviewNote: string;
}

export interface TermsContent {
  seoTitle: string;
  metaDescription: string;
  title: string;
  points: string[];
}

export interface FooterContent {
  brandName: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  whatsappUrl: string;
  copyright: string;
  developerCredit?: string;
}

export interface SEOContent {
  primaryKeywords: string[];
  secondaryKeywords: string[];
}

export interface SiteContent {
  homepage: HomepageContent;
  about: AboutContent;
  categories: CategoriesContent;
  shipping: ShippingContent;
  returns: ReturnsContent;
  contact: ContactContent;
  faqs: FAQItem[];
  privacy: PrivacyContent;
  terms: TermsContent;
  footer: FooterContent;
  seo: SEOContent;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  homepage: {
    seoTitle: "Mun Creations | Premium Sarees, Handloom Sarees & Indian Ethnic Wear",
    metaDescription: "Discover premium sarees and Indian ethnic wear at Mun Creations. Shop Banarasi, Tussar, Kanjivaram, handloom, designer and festive sarees with worldwide shipping.",
    hero: {
      title: "Timeless Sarees. Authentic Craftsmanship.",
      subtitle: "Discover the beauty of Indian textiles through a thoughtfully curated collection of sarees crafted with tradition, artistry and contemporary elegance.",
      description: "From timeless Banarasi and Kanjivaram sarees to exquisite Tussar, handloom and designer collections, Mun Creations brings India's rich textile heritage closer to you.",
      ctaText: "Explore the Collection",
      ctaLink: "#collection-section",
      cta2Text: "Shop Sarees",
      cta2Link: "/shop"
    },
    brandIntro: {
      title: "The Art of Indian Draping",
      p1: "At Mun Creations, every saree represents more than fabric. It represents generations of craftsmanship, cultural heritage and the timeless elegance of Indian fashion.",
      p2: "Our collection brings together traditional weaves, intricate craftsmanship and contemporary designs for weddings, festivals, celebrations and everyday elegance.",
      p3: "Whether you are searching for a classic Banarasi silk saree, an elegant Tussar saree or a statement designer drape, explore a collection created for moments that deserve to be remembered."
    },
    categorySection: {
      title: "Explore Our Collections",
      subtitle: "Curated weaves inspired by generations of Indian textile artistry",
      items: [
        {
          slug: "banarasi",
          name: "Banarasi Sarees",
          description: "Experience the richness of Banarasi weaving through luxurious silk sarees featuring intricate motifs and timeless zari craftsmanship."
        },
        {
          slug: "kanjivaram",
          name: "Kanjivaram Sarees",
          description: "Discover the iconic elegance of South Indian silk with traditional Kanjivaram-inspired designs, rich colors and distinctive borders."
        },
        {
          slug: "tussar",
          name: "Tussar Sarees",
          description: "Explore the natural beauty and distinctive texture of Tussar silk, from traditional handloom styles to contemporary interpretations."
        },
        {
          slug: "designer",
          name: "Designer Sarees",
          description: "Make a statement with carefully selected designer sarees created for celebrations, special occasions and modern wardrobes."
        },
        {
          slug: "handloom",
          name: "Handloom Sarees",
          description: "Celebrate India's weaving traditions with handloom sarees that showcase distinctive textures, patterns and artisanal craftsmanship."
        },
        {
          slug: "wedding-festive",
          name: "Festive & Wedding Sarees",
          description: "Find elegant sarees for weddings, festivals, receptions and other memorable occasions."
        }
      ]
    },
    brandStory: {
      eyebrow: "Heritage & Craftsmanship",
      title: "Where Heritage Meets Contemporary Elegance",
      body: "Mun Creations celebrates the diversity of Indian textiles by bringing traditional craftsmanship together with contemporary styling. Our collections are curated for women who appreciate authentic craftsmanship, refined details and timeless Indian fashion. From intricate zari work to distinctive handloom textures, every collection is selected with an appreciation for the artistry behind the saree."
    },
    trustSection: {
      title: "Crafted with Care",
      items: [
        "Authentic Indian craftsmanship",
        "Thoughtfully curated collections",
        "Secure online shopping",
        "Worldwide shipping",
        "Customer assistance through WhatsApp"
      ]
    },
    cta: {
      title: "Find Your Perfect Saree",
      description: "Discover timeless drapes curated for weddings, festive moments and elegant celebrations.",
      buttonText: "Shop the Collection",
      buttonLink: "/shop"
    }
  },
  about: {
    seoTitle: "About Mun Creations | Indian Sarees, Handlooms & Artisanal Heritage",
    metaDescription: "Learn about Mun Creations, our dedication to traditional Indian handlooms, authentic craftsmanship and timeless saree collections.",
    eyebrow: "Our Story",
    title: "Preserving the Art and Elegance of Indian Sarees",
    introP1: "Mun Creations was born from a passion for Indian textiles and the timeless grace of the saree. We believe that a saree is not just an outfit — it is a living expression of India's cultural heritage, woven with patience, skill and pride.",
    introP2: "Our mission is to bring together the finest Indian weaves, from the royal looms of Varanasi to the artisanal clusters producing authentic Tussar, Kanjivaram-inspired classics and handloom masterpieces.",
    introP3: "By combining traditional craftsmanship with contemporary curation, Mun Creations makes authentic Indian ethnic wear accessible to saree lovers around the world.",
    philosophy: {
      title: "Our Philosophy",
      subtitle: "Craftsmanship. Authenticity. Timeless Grace.",
      description: "At Mun Creations, we curate sarees that honor centuries of weaving tradition while offering silhouettes and palettes suited for modern occasions.",
      styles: [
        "Authentic textile traditions",
        "Curated for weddings, celebrations and everyday elegance",
        "Respect for artisanal techniques",
        "Thoughtfully designed shopping experience"
      ]
    },
    promise: {
      title: "Our Promise to You",
      description: "We are committed to delivering sarees that reflect authentic Indian craftsmanship, dependable quality and timeless beauty. Whether you are choosing a saree for a wedding, festive celebration or a personal milestone, Mun Creations is honored to be part of your journey."
    }
  },
  categories: {
    sarees: {
      seoTitle: "Sarees Online | Buy Designer, Handloom & Silk Sarees | Mun Creations",
      metaDescription: "Explore our curated collection of sarees online at Mun Creations. Shop Banarasi, Tussar, Kanjivaram, handloom and designer sarees with worldwide shipping.",
      title: "Sarees Online",
      subtitle: "Timeless Drapes for Every Celebration",
      description: "Explore the complete saree collection at Mun Creations. From rich festive silks and intricate Banarasi weaves to breathable handlooms and contemporary designer styles, find the perfect drape for weddings, festivals and memorable occasions.",
      shopByList: [
        "Banarasi Sarees",
        "Kanjivaram Sarees",
        "Tussar Sarees",
        "Handloom Sarees",
        "Designer Sarees",
        "Wedding & Festive Sarees"
      ],
      perfectFor: [
        "Weddings, receptions and bridal celebrations",
        "Festivals such as Diwali, Durga Puja, Navratri and Eid",
        "Special events, gatherings and cultural occasions",
        "Gifting for milestones and celebrations"
      ]
    },
    banarasi: {
      seoTitle: "Banarasi Sarees Online | Pure Silk & Katan Banarasi Sarees | Mun Creations",
      metaDescription: "Shop authentic Banarasi sarees online at Mun Creations. Discover handcrafted Banarasi silk sarees with rich zari work, intricate motifs and royal elegance.",
      title: "Banarasi Sarees",
      subtitle: "The Timeless Splendor of Varanasi",
      description: "Known for their opulent zari work, intricate floral motifs and royal heritage, Banarasi sarees have adorned celebrations for generations. At Mun Creations, our Banarasi collection features handpicked weaves that celebrate the artistry and richness of Indian silk traditions.",
      perfectFor: [
        "Bridal wear and wedding celebrations",
        "Grand receptions and festive occasions",
        "Timeless additions to your heirloom wardrobe"
      ],
      closing: "Experience the regal elegance of Banarasi silk drapes curated for unforgettable moments."
    },
    tussar: {
      seoTitle: "Tussar Silk Sarees Online | Handloom & Printed Tussar Sarees | Mun Creations",
      metaDescription: "Buy exquisite Tussar silk sarees online at Mun Creations. Explore handloom Tussar sarees with distinctive textures, elegant prints and rich borders.",
      title: "Tussar Sarees",
      subtitle: "Understated Elegance and Natural Texture",
      description: "Tussar silk is renowned for its rich texture, natural golden sheen and breathable comfort. Mun Creations brings you a curated collection of Tussar sarees featuring traditional motifs, block prints, handloom weaves and contemporary styling.",
      perfectFor: [
        "Day weddings and intimate festive gatherings",
        "Cultural celebrations and office events",
        "Elegant daytime and evening wear"
      ],
      closing: "Discover the distinct charm and effortless grace of authentic Tussar silk."
    },
    kanjivaram: {
      seoTitle: "Kanjivaram Sarees Online | Traditional South Indian Silk Sarees | Mun Creations",
      metaDescription: "Shop beautiful Kanjivaram sarees online at Mun Creations. Explore rich silk sarees with traditional temple borders, contrast pallus and festive colors.",
      title: "Kanjivaram Sarees",
      subtitle: "The Crown Jewel of South Indian Silk",
      description: "With their vibrant colors, rich contrast borders and iconic temple motifs, Kanjivaram-inspired sarees represent one of India's most celebrated textile traditions. Our collection is curated to bring you the majestic beauty and festive splendor of South Indian silk styling.",
      perfectFor: [
        "Traditional weddings and ceremonies",
        "Grand festivals and family celebrations",
        "Memorable occasions requiring timeless grandeur"
      ],
      closing: "Drape yourself in the regal tradition of Kanjivaram elegance."
    },
    designer: {
      seoTitle: "Designer Sarees Online | Contemporary & Party Wear Sarees | Mun Creations",
      metaDescription: "Shop modern designer sarees online at Mun Creations. Discover elegant party wear sarees, contemporary drapes and statement sarees for special occasions.",
      title: "Designer Sarees",
      subtitle: "Modern Elegance Meets Traditional Artistry",
      description: "For women who love contemporary silhouettes, subtle embellishments and modern palettes, our designer saree collection offers the perfect blend of innovation and elegance. Each saree is selected to ensure you stand out at parties, cocktail evenings and festive gatherings.",
      perfectFor: [
        "Cocktail parties and evening receptions",
        "Festive celebrations and social gatherings",
        "Modern occasion wear"
      ],
      closing: "Explore contemporary designs that redefine modern Indian style."
    },
    handloom: {
      seoTitle: "Handloom Sarees Online | Authentic Indian Handwoven Sarees | Mun Creations",
      metaDescription: "Discover authentic handloom sarees online at Mun Creations. Shop handcrafted sarees made by skilled artisans across India with sustainable beauty.",
      title: "Handloom Sarees",
      subtitle: "The Soul of Indian Weaving",
      description: "Handloom sarees celebrate the skill, patience and heritage of Indian weavers. Crafted with natural fibers and traditional weaving techniques, each saree carries subtle irregularities that reflect authentic handmade artistry.",
      designedFor: [
        "Artisanal craftsmanship and sustainable fashion",
        "Comfortable, breathable drapes for every occasion",
        "Timeless appeal that transcends seasonal trends"
      ],
      closing: "Support the living traditions of India's master weavers with Mun Creations."
    },
    "wedding-festive": {
      seoTitle: "Wedding & Festive Sarees Online | Bridal & Party Sarees | Mun Creations",
      metaDescription: "Shop festive and wedding sarees online at Mun Creations. Discover rich silk sarees, embroidered drapes and bridal collections for your celebrations.",
      title: "Festive & Wedding Sarees",
      subtitle: "Celebrate Life's Most Beautiful Moments",
      description: "From bridal elegance to festive joy, our wedding and festive saree collection is curated to make every celebration unforgettable. Featuring rich silks, radiant colors, elaborate zari work and timeless motifs, find the saree that makes your special day complete.",
      perfectFor: [
        "Brides, bridesmaids and wedding guests",
        "Festivals including Diwali, Durga Puja, Eid and Pongal",
        "Anniversary celebrations and formal family gatherings"
      ],
      closing: "Make every celebration memorable with Mun Creations."
    }
  },
  shipping: {
    seoTitle: "Shipping & Delivery Policy | Mun Creations",
    metaDescription: "Learn about shipping times, delivery options and international shipping policies at Mun Creations. Reliable worldwide delivery for all saree orders.",
    title: "Shipping & Delivery Policy",
    subtitle: "Delivering Craftsmanship to Your Doorstep",
    intro: "At Mun Creations, we take pride in delivering your sarees safely, securely and promptly. Every order is carefully packed to ensure your sarees arrive in pristine condition.",
    orderProcessingTitle: "Order Processing",
    orderProcessingBody: "Orders are processed within 1 to 3 business days following confirmation of payment. Made-to-order, custom blouse-stitched or specialty handloom pieces may require additional preparation time as indicated on the product page.",
    internationalShippingTitle: "International Shipping",
    internationalShippingBody: "We offer worldwide shipping to ensure saree lovers across the globe can experience our collections. International delivery timelines typically range between 7 to 15 business days depending on the destination country and customs clearance.",
    importantTitle: "Delivery Assistance & Tracking",
    importantBody: "Once your order has been dispatched, tracking details will be shared through email and WhatsApp. For any questions regarding your shipment, our team is readily available.",
    whatsappNumber: "+91 98745 72846",
    whatsappUrl: "https://wa.me/919874572846"
  },
  returns: {
    seoTitle: "Returns & Customer Service | Mun Creations",
    metaDescription: "Find information on returns, exchanges and customer support at Mun Creations. Easy assistance via WhatsApp at +91 98745 72846.",
    title: "Returns & Customer Service",
    subtitle: "We Are Dedicated to Your Complete Satisfaction",
    body: "At Mun Creations, we strive to ensure that every saree you receive exceeds your expectations. If you experience an issue with your order — such as receiving a damaged item, an incorrect product or a delivery concern — our team is here to assist you promptly.",
    buttonText: "Contact Us on WhatsApp",
    whatsappNumber: "+91 98745 72846",
    whatsappUrl: "https://wa.me/919874572846",
    note: "Please retain all original tags, packaging and invoice when contacting customer service regarding a return or replacement enquiry."
  },
  contact: {
    seoTitle: "Contact Us | Mun Creations Customer Support & Enquiries",
    metaDescription: "Contact Mun Creations for order assistance, saree inquiries and customer support. Reach us via WhatsApp at +91 98745 72846 or through our inquiry form.",
    title: "Contact Mun Creations",
    subtitle: "We're Here to Help",
    body: "Have a question about a saree, your order, shipping or our collections? Our Customer Service team is available to assist you.",
    whatsappNumber: "+91 98745 72846",
    whatsappUrl: "https://wa.me/919874572846",
    productEnquiriesTitle: "Product Enquiries",
    productEnquiriesBody: "For product-related enquiries, please mention the product name or SKU when contacting us.",
    orderAssistanceTitle: "Order Assistance",
    orderAssistanceBody: "For order-related assistance, please provide your order number so our team can locate your order quickly."
  },
  faqs: [
    {
      id: "faq-1",
      question: "Are your sarees authentic handloom?",
      answer: "Yes, our handloom collection features authentic handwoven sarees created by traditional weavers across India. Each handloom saree showcases distinctive weave textures that celebrate genuine artisanal craft."
    },
    {
      id: "faq-2",
      question: "Do you ship internationally?",
      answer: "Yes, Mun Creations ships worldwide. International shipping charges and delivery estimates are calculated during checkout based on destination."
    },
    {
      id: "faq-3",
      question: "How long does delivery take?",
      answer: "Domestic orders within India typically arrive within 4 to 7 business days. International orders generally take 7 to 15 business days depending on location and customs."
    },
    {
      id: "faq-4",
      question: "How should I care for my silk sarees?",
      answer: "We recommend dry cleaning for all pure silk, Banarasi, Kanjivaram and embellished sarees. Store sarees in breathable cotton bags away from moisture and direct sunlight."
    },
    {
      id: "faq-5",
      question: "Can I get assistance choosing a saree?",
      answer: "Absolutely! Our team is available through WhatsApp at +91 98745 72846 to assist you with product details, styling advice and order placement."
    },
    {
      id: "faq-6",
      question: "Does the saree come with an unstitched blouse piece?",
      answer: "Most sarees in our collection include an attached unstitched running blouse piece. Please check the individual product specification on the product page for exact blouse fabric details."
    },
    {
      id: "faq-7",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, Net Banking, and international cards via our secure encrypted payment gateway."
    },
    {
      id: "faq-8",
      question: "What should I do if my saree arrives damaged?",
      answer: "In the rare event that an item arrives damaged or incorrect, please reach out to us via WhatsApp at +91 98745 72846 within 48 hours of delivery with photos of the package and item for immediate resolution."
    }
  ],
  privacy: {
    seoTitle: "Privacy Policy | Mun Creations",
    metaDescription: "Read the Mun Creations privacy policy to learn how we protect your personal information, handle customer data and safeguard online transactions.",
    title: "Privacy Policy",
    subtitle: "Your Privacy and Trust Are Our Highest Priority",
    intro: "Mun Creations is committed to protecting the privacy and confidentiality of our customers. This Privacy Policy outlines how we collect, use and safeguard your personal information when you visit our website or purchase from our collections.",
    collectionIntro: "We collect information necessary to provide a smooth shopping experience, including:",
    collectionPoints: [
      "Contact information (name, email address, phone number, shipping address)",
      "Order details and transaction history",
      "Customer service communications and feedback"
    ],
    typesIntro: "This information is gathered to:",
    typesPoints: [
      "Process and deliver your saree orders accurately",
      "Provide customer support and order updates through email and WhatsApp",
      "Improve our website experience, collections and services"
    ],
    paymentNote: "Payment card details and sensitive financial data are processed securely by our certified payment gateway partners and are never stored on Mun Creations servers.",
    usageIntro: "We respect your personal privacy:",
    usagePoints: [
      "We do not sell, rent or trade your personal information to third parties.",
      "Data is only shared with trusted logistics and payment partners necessary to fulfill your orders.",
      "You may request updates to or deletion of your customer information at any time."
    ],
    legalReviewNote: "This policy may be updated periodically to reflect changes in our services or relevant regulations. For questions regarding privacy, contact care@muncreation.com."
  },
  terms: {
    seoTitle: "Terms & Conditions | Mun Creations",
    metaDescription: "Review the terms and conditions for shopping at Mun Creations, including order processing, payments, product descriptions and website usage policies.",
    title: "Terms & Conditions",
    points: [
      "By accessing or using the Mun Creations website, you agree to comply with these terms and conditions.",
      "All product images and descriptions are presented as accurately as possible. Subtle variations in color or texture may occur due to photography lighting, monitor displays or handmade weaving processes.",
      "Product availability may change without prior notice.",
      "Prices, product information and availability may be updated from time to time.",
      "Orders are subject to successful payment confirmation and product availability.",
      "Mun Creations reserves the right to correct pricing, product information or availability errors where necessary.",
      "For questions regarding an order or product, contact Customer Service through WhatsApp at +91 98745 72846."
    ]
  },
  footer: {
    brandName: "Mun Creations",
    tagline: "Timeless Indian Craftsmanship. Contemporary Elegance.",
    description: "Discover curated sarees and Indian ethnic wear inspired by India's rich textile heritage.",
    whatsappNumber: "+91 98745 72846",
    whatsappUrl: "https://wa.me/919874572846",
    copyright: "© 2026 Mun Creations. All Rights Reserved.",
    developerCredit: "Designed and Developed By NIDESIGNZ"
  },
  seo: {
    primaryKeywords: [
      "sarees online",
      "buy sarees online",
      "Indian sarees",
      "saree online",
      "silk sarees",
      "designer sarees",
      "handloom sarees",
      "Banarasi sarees",
      "Tussar sarees",
      "Kanjivaram sarees",
      "wedding sarees",
      "festive sarees",
      "Indian ethnic wear"
    ],
    secondaryKeywords: [
      "Banarasi silk saree",
      "Tussar silk saree",
      "handloom silk saree",
      "traditional Indian sarees",
      "luxury sarees",
      "sarees for weddings",
      "sarees for festivals",
      "designer Indian sarees",
      "traditional silk sarees",
      "Indian saree collection"
    ]
  }
};
