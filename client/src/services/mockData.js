import heroBridalImg from "../assets/images/hero_banarasi_bridal_1791698980254.jpg";
import kanjivaramImg from "../assets/images/saree_kanjivaram_gold_1791698990300.jpg";
import chanderiImg from "../assets/images/saree_chanderi_pastel_1791699001746.jpg";
import banarasiBlueImg from "../assets/images/saree_banarasi_blue_1791699014715.jpg";
export const INITIAL_CATEGORIES = [
  {
    id: "cat-banarasi",
    name: "Banarasi Silk",
    slug: "banarasi-silk",
    description: "Centuries-old royal weaving from Varanasi with exquisite real zari motifs and timeless elegance.",
    image: heroBridalImg,
    productCount: 14,
    tagline: "Imperial Majesty from Varanasi"
  },
  {
    id: "cat-kanjivaram",
    name: "Kanjivaram Silk",
    slug: "kanjivaram-silk",
    description: "Heirloom South Indian temple silks handwoven in Kanchipuram with pure mulberry threads.",
    image: kanjivaramImg,
    productCount: 18,
    tagline: "Temple Zari & Heavy Brocade"
  },
  {
    id: "cat-chanderi",
    name: "Chanderi & Organza",
    slug: "chanderi-organza",
    description: "Feather-light sheer weaves from Madhya Pradesh adorned with golden buttis and pastel charm.",
    image: chanderiImg,
    productCount: 12,
    tagline: "Graceful Sheer Gossamer"
  },
  {
    id: "cat-georgette",
    name: "Georgette & Chiffon",
    slug: "georgette-chiffon",
    description: "Flowing contemporary drapes with delicate sequins, zari borders, and effortless pleats.",
    image: banarasiBlueImg,
    productCount: 16,
    tagline: "Modern Elegance in Motion"
  },
  {
    id: "cat-bridal",
    name: "Bridal Heritage",
    slug: "bridal-heritage",
    description: "Grand trousseau masterpieces featuring heavy hand zardosi, antique brocade, and vermillion hues.",
    image: heroBridalImg,
    productCount: 9,
    tagline: "The Ultimate Wedding Legacy"
  },
  {
    id: "cat-cotton",
    name: "Handloom Cotton",
    slug: "handloom-cotton",
    description: "Breathable artisanal cottons, Jamdani, and linen weaves for mindful everyday royalty.",
    image: chanderiImg,
    productCount: 15,
    tagline: "Pure Comfort, Pure Craft"
  }
];
export const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Shahi Dulhan Crimson Banarasi Katan Silk Saree",
    slug: "shahi-dulhan-crimson-banarasi-katan-silk-saree",
    price: 18499,
    originalPrice: 24999,
    discountPercent: 26,
    description: "A masterpiece from the master looms of Varanasi. Handcrafted in pure Katan silk with intricate antique gold zardosi border and floral jaal detailing across the body. Designed for bridal grace and regal celebrations.",
    category: "banarasi-silk",
    fabric: "Banarasi Silk",
    color: "Crimson Maroon & Gold",
    colorHex: "#6b1426",
    occasion: "Bridal & Wedding",
    stock: 8,
    sku: "SS-BAN-001",
    images: [heroBridalImg, kanjivaramImg],
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    blousePieceIncluded: true,
    sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
    careInstructions: "Strictly dry clean only. Wrap in muslin cloth when storing.",
    weavingTechnique: "Katan Silk Handloom",
    artisan: "Master Weaver Bismillah Ansari, Varanasi Looms",
    specifications: {
      Weave: "Handloom Katan Weave",
      Zari: "Antique Gold Tested Zari",
      Origin: "Varanasi, Uttar Pradesh",
      Weight: "880 grams",
      Blouse: "Matching heavy woven brocade"
    },
    createdAt: "2026-09-01T10:00:00Z"
  },
  {
    id: "prod-2",
    name: "Mayil Emerald Kanchipuram Pure Mulberry Silk Saree",
    slug: "mayil-emerald-kanchipuram-pure-mulberry-silk-saree",
    price: 21999,
    originalPrice: 28999,
    discountPercent: 24,
    description: "Authentic Kanjivaram silk saree in rich deep emerald green with contrasting ruby red temple borders and opulent peacock (mayil) motifs handwoven using certified gold zari threads.",
    category: "kanjivaram-silk",
    fabric: "Kanjivaram Silk",
    color: "Emerald Green & Ruby Red",
    colorHex: "#0d5c3a",
    occasion: "Festive",
    stock: 5,
    sku: "SS-KAN-002",
    images: [kanjivaramImg, heroBridalImg],
    rating: 5,
    reviewsCount: 94,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    blousePieceIncluded: true,
    sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
    careInstructions: "Dry clean only. Avoid spraying perfumes directly on zari.",
    weavingTechnique: "Korvai Interlock",
    artisan: "Kanchipuram Temple Weavers Guild, Tamil Nadu",
    specifications: {
      Weave: "Korvai 3-ply Silk Weave",
      Zari: "Certified Pure Silk Mark & Heavy Zari",
      Origin: "Kanchipuram, Tamil Nadu",
      Weight: "920 grams",
      Blouse: "Ruby red with temple border"
    },
    createdAt: "2026-09-12T10:00:00Z"
  },
  {
    id: "prod-3",
    name: "Gulabi Meera Pastel Tissue Chanderi Saree",
    slug: "gulabi-meera-pastel-tissue-chanderi-saree",
    price: 7499,
    originalPrice: 9999,
    discountPercent: 25,
    description: "Whisper-light Chanderi tissue silk saree in ethereal blush rose pink. Featuring miniature gold ashrafi bootis scattered throughout with a soft scalloped zari border. Effortlessly graceful for summer weddings and daytime receptions.",
    category: "chanderi-organza",
    fabric: "Chanderi",
    color: "Blush Rose Pink",
    colorHex: "#d89ba6",
    occasion: "Party Wear",
    stock: 14,
    sku: "SS-CHA-003",
    images: [chanderiImg, banarasiBlueImg],
    rating: 4.8,
    reviewsCount: 67,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    blousePieceIncluded: true,
    sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
    careInstructions: "Dry clean recommended. Gentle hand steam ironing.",
    weavingTechnique: "Chanderi Pattu & Gossamer",
    artisan: "Chanderi Heritage Weaver Society, Madhya Pradesh",
    specifications: {
      Weave: "Fine Handwoven Chanderi Pattu",
      Zari: "Light Gold Muted Sheen",
      Origin: "Chanderi, Madhya Pradesh",
      Weight: "450 grams",
      Blouse: "Tonal silk with booti work"
    },
    createdAt: "2026-09-20T10:00:00Z"
  },
  {
    id: "prod-4",
    name: "Neelambari Royal Blue Banarasi Georgette Jaal Saree",
    slug: "neelambari-royal-blue-banarasi-georgette-jaal-saree",
    price: 13999,
    originalPrice: 17999,
    discountPercent: 22,
    description: "Drape in royal luxury with this midnight navy blue pure Banarasi georgette saree. Adorned with intricate antique silver floral jaal weaving and scalloped pallu borders. Extremely supple, wrinkle-resistant, and photogenic.",
    category: "georgette-chiffon",
    fabric: "Georgette",
    color: "Royal Navy Blue & Silver",
    colorHex: "#14234b",
    occasion: "Party Wear",
    stock: 11,
    sku: "SS-GEO-004",
    images: [banarasiBlueImg, heroBridalImg],
    rating: 4.9,
    reviewsCount: 82,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    blousePieceIncluded: true,
    sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
    careInstructions: "Dry clean only.",
    weavingTechnique: "Khaddi Georgette",
    artisan: "Banarasi Khaddi Georgette Weavers Collective",
    specifications: {
      Weave: "Banarasi Khaddi Georgette",
      Zari: "Antique Silver Rupa Zari",
      Origin: "Varanasi, Uttar Pradesh",
      Weight: "620 grams",
      Blouse: "Navy brocade with matching border"
    },
    createdAt: "2026-09-25T10:00:00Z"
  },
  {
    id: "prod-5",
    name: "Rajkumari Scarlet Banarasi Jangla Bridal Silk Saree",
    slug: "rajkumari-scarlet-banarasi-jangla-bridal-silk-saree",
    price: 24999,
    originalPrice: 32e3,
    discountPercent: 22,
    description: "Heritage Jangla weaving in deep scarlet red. The all-over gold hunting and floral motifs represent the peak of Banarasi artisanal craftsmanship. Reserved for connoisseurs of authentic bridal trousseau.",
    category: "bridal-heritage",
    fabric: "Banarasi Silk",
    color: "Scarlet Red & Royal Gold",
    colorHex: "#881930",
    occasion: "Bridal & Wedding",
    stock: 4,
    sku: "SS-BRI-005",
    images: [heroBridalImg, kanjivaramImg],
    rating: 5,
    reviewsCount: 45,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    blousePieceIncluded: true,
    sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
    careInstructions: "Preserve with natural neem leaves and dry clean only.",
    weavingTechnique: "Kadwa Brocade",
    artisan: "Master Weaver Bismillah Ansari, Varanasi Looms",
    specifications: {
      Weave: "Pure Kadwa Jangla Handloom",
      Zari: "24K Micron Gold Electroplated Zari",
      Origin: "Varanasi, Uttar Pradesh",
      Weight: "980 grams",
      Blouse: "Rich Kadwa woven brocade"
    },
    createdAt: "2026-10-01T10:00:00Z"
  },
  {
    id: "prod-6",
    name: "Svarnam Antique Mustard Kanjivaram Brocade Saree",
    slug: "svarnam-antique-mustard-kanjivaram-brocade-saree",
    price: 16999,
    originalPrice: 21999,
    discountPercent: 23,
    description: "Luminous antique mustard yellow Kanjivaram saree with contrasting magenta pink pallu and elephant rudraksh border. Ideal for auspicious morning rituals and traditional pujas.",
    category: "kanjivaram-silk",
    fabric: "Kanjivaram Silk",
    color: "Mustard Yellow & Magenta",
    colorHex: "#c59b27",
    occasion: "Traditional Pooja",
    stock: 7,
    sku: "SS-KAN-006",
    images: [kanjivaramImg, banarasiBlueImg],
    rating: 4.7,
    reviewsCount: 39,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    blousePieceIncluded: true,
    sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
    careInstructions: "Dry clean only.",
    weavingTechnique: "Jacquard & Zari",
    artisan: "Kanchipuram Temple Weavers Guild, Tamil Nadu",
    specifications: {
      Weave: "Traditional Kanchi Jacquard Weave",
      Zari: "Dual-tone gold zari",
      Origin: "Kanchipuram, Tamil Nadu",
      Weight: "850 grams",
      Blouse: "Magenta unstitched silk piece"
    },
    createdAt: "2026-09-18T10:00:00Z"
  },
  {
    id: "prod-7",
    name: "Padmavati Ivory Jamdani Muslin Handloom Cotton Saree",
    slug: "padmavati-ivory-jamdani-muslin-handloom-cotton-saree",
    price: 6899,
    originalPrice: 9499,
    discountPercent: 27,
    description: "Authentic Jamdani hand-woven muslin cotton saree in celestial ivory white with antique gold thread floral vine motifs. Featherlight, breathable, and woven on traditional pit looms.",
    category: "handloom-cotton",
    fabric: "Cotton Silk",
    color: "Ivory White & Gold",
    colorHex: "#fcf8ec",
    occasion: "Casual",
    stock: 12,
    sku: "SS-JAM-007",
    images: [chanderiImg, heroBridalImg],
    rating: 4.8,
    reviewsCount: 52,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    blousePieceIncluded: true,
    sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
    careInstructions: "Gentle hand wash in cold water or dry clean.",
    weavingTechnique: "Jamdani Handloom",
    artisan: "Bengal Jamdani Artisan Cooperative",
    specifications: {
      Weave: "Jamdani Supplementary Weft Handloom",
      Origin: "Phulia & Shantipur, West Bengal",
      Zari: "Fine Muted Gold Zari",
      Weight: "380 grams",
      Blouse: "Ivory cotton with gold border"
    },
    createdAt: "2026-10-05T10:00:00Z"
  },
  {
    id: "prod-8",
    name: "Roopmati Rani Pink Paithani Pure Silk Saree",
    slug: "roopmati-rani-pink-paithani-pure-silk-saree",
    price: 31999,
    originalPrice: 42e3,
    discountPercent: 24,
    description: "Prestigious Yeola Paithani handloom saree in radiant rani pink silk with signature kaleidoscopic peacock (morpankhi) pallu woven in genuine gold zari and oblique kaleidoscopic border.",
    category: "bridal-heritage",
    fabric: "Pure Silk",
    color: "Rani Pink & Gold",
    colorHex: "#c2185b",
    occasion: "Bridal & Wedding",
    stock: 3,
    sku: "SS-PAI-008",
    images: [heroBridalImg, kanjivaramImg],
    rating: 5,
    reviewsCount: 38,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    blousePieceIncluded: true,
    sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
    careInstructions: "Specialist dry clean only. Store in pure cotton bag.",
    weavingTechnique: "Kadwa Brocade",
    artisan: "Yeola Paithani Artisan Guild, Maharashtra",
    specifications: {
      Weave: "Tapestry Weave with Real Zari Pallu",
      Origin: "Yeola, Maharashtra",
      Zari: "Pure Metallic Gold Tested Zari",
      Weight: "940 grams",
      Blouse: "Rani pink silk with peacock border"
    },
    createdAt: "2026-10-08T10:00:00Z"
  }
];
export const INITIAL_COUPONS = [
  {
    id: "c-1",
    code: "ROYAL15",
    description: "15% instant discount on orders above \u20B94,999 (Max \u20B91,500)",
    discountPercent: 15,
    minOrderValue: 4999,
    maxDiscount: 1500,
    expiryDate: "2026-12-31",
    isActive: true
  },
  {
    id: "c-2",
    code: "FIRST10",
    description: "Welcome special: 10% off on your very first ethnic order",
    discountPercent: 10,
    minOrderValue: 2e3,
    maxDiscount: 1e3,
    expiryDate: "2026-12-31",
    isActive: true
  },
  {
    id: "c-3",
    code: "FESTIVE500",
    description: "Flat \u20B9500 discount on orders above \u20B93,000",
    discountAmount: 500,
    minOrderValue: 3e3,
    expiryDate: "2026-12-31",
    isActive: true
  }
];
export const DEMO_USER = {
  id: "usr-customer-1",
  name: "Priyanka Sharma",
  email: "priyanka@sareesansar.com",
  phone: "9876543210",
  alternatePhone: "9812345678",
  role: "customer",
  gender: "female",
  dateOfBirth: "1994-06-21",
  anniversary: "2020-11-28",
  twoFactorEnabled: false,
  preferences: {
    whatsappAlerts: true,
    smsTracking: true,
    newsletter: true,
    preferredFabrics: ["Banarasi Silk", "Kanjivaram Silk"]
  },
  activeSessions: [
    {
      id: "sess-1",
      device: "MacBook Pro (macOS Sequoia)",
      browser: "Chrome 131.0",
      location: "New Delhi, India",
      ip: "103.21.244.18",
      lastActive: "Active Now",
      isCurrent: true
    },
    {
      id: "sess-2",
      device: "Apple iPhone 15 Pro (iOS 18.2)",
      browser: "Mobile Safari",
      location: "Gurugram, India",
      ip: "49.36.128.45",
      lastActive: "3 hours ago",
      isCurrent: false
    }
  ],
  securityLogs: [
    {
      id: "sec-1",
      event: "Web Portal Login",
      ip: "103.21.244.18",
      timestamp: "2026-10-15 09:12 AM",
      location: "New Delhi, India",
      status: "SUCCESS"
    },
    {
      id: "sec-2",
      event: "Password Changed",
      ip: "103.21.244.18",
      timestamp: "2026-09-28 04:45 PM",
      location: "New Delhi, India",
      status: "SUCCESS"
    },
    {
      id: "sec-3",
      event: "New Delivery Address Added (Work)",
      ip: "49.36.128.45",
      timestamp: "2026-09-14 11:30 AM",
      location: "Gurugram, India",
      status: "SUCCESS"
    }
  ],
  createdAt: "2026-08-15T09:00:00Z",
  addresses: [
    {
      id: "addr-1",
      fullName: "Priyanka Sharma",
      phone: "9876543210",
      alternatePhone: "9812345678",
      pincode: "110001",
      state: "Delhi",
      city: "New Delhi",
      locality: "Connaught Place",
      addressLine: "Flat 402, Regalia Heights, Barakhamba Road",
      landmark: "Near Metro Gate 3",
      isDefault: true,
      type: "HOME"
    },
    {
      id: "addr-2",
      fullName: "Priyanka Sharma (Office)",
      phone: "9876543210",
      alternatePhone: "",
      pincode: "122002",
      state: "Haryana",
      city: "Gurugram",
      locality: "Cyber City",
      addressLine: "Building 10B, 6th Floor, DLF CyberHub",
      landmark: "Near Rapid Metro Station",
      isDefault: false,
      type: "WORK"
    }
  ]
};
export const DEMO_ADMIN = {
  id: "usr-admin-1",
  name: "Ananya Singhania (Store Manager)",
  email: "admin@sareesansar.com",
  phone: "9811122233",
  role: "admin",
  createdAt: "2026-01-01T00:00:00Z"
};
export const INITIAL_ORDERS = [
  {
    id: "ord-1042",
    orderNumber: "SS-ORD-9281",
    userId: "usr-customer-1",
    userEmail: "priyanka@sareesansar.com",
    userName: "Priyanka Sharma",
    items: [
      {
        id: "ci-1",
        productId: "prod-1",
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      }
    ],
    subtotal: 18499,
    discount: 1500,
    couponCode: "ROYAL15",
    shippingFee: 0,
    tax: 918,
    totalAmount: 17917,
    paymentMethod: "RAZORPAY",
    paymentStatus: "PAID",
    razorpayPaymentId: "pay_K7q8mN2vP4z1L9",
    razorpayOrderId: "order_M8n2kL90pQ7vX2",
    orderStatus: "SHIPPED",
    shippingAddress: DEMO_USER.addresses[0],
    trackingNumber: "DEL-IND-8821092",
    courierPartner: "BlueDart Air Express",
    estimatedDelivery: "2026-10-14",
    timeline: [
      {
        status: "PLACED",
        title: "Order Placed",
        description: "Payment verified via Razorpay Checkout.",
        timestamp: "2026-10-08 14:30",
        completed: true
      },
      {
        status: "CONFIRMED",
        title: "Order Confirmed",
        description: "Quality inspection passed by master weaver.",
        timestamp: "2026-10-09 10:15",
        completed: true
      },
      {
        status: "PACKED",
        title: "Safely Packaged",
        description: "Wrapped in royal muslin box with Silk Mark card.",
        timestamp: "2026-10-09 16:40",
        completed: true
      },
      {
        status: "SHIPPED",
        title: "Dispatched via BlueDart",
        description: "Waybill #DEL-IND-8821092 in transit to Delhi hub.",
        timestamp: "2026-10-10 09:20",
        completed: true
      },
      {
        status: "OUT_FOR_DELIVERY",
        title: "Out for Delivery",
        description: "Courier agent will deliver with OTP confirmation.",
        timestamp: "Pending",
        completed: false
      },
      {
        status: "DELIVERED",
        title: "Delivered",
        description: "Handed over to customer.",
        timestamp: "Pending",
        completed: false
      }
    ],
    createdAt: "2026-10-08T14:30:00Z"
  }
];
