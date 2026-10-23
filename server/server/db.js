import fs from "fs";
import path from "path";
const DB_FILE = path.join(process.cwd(), "data", "database.json");
export class Database {
  products = [];
  categories = [];
  users = [];
  orders = [];
  coupons = [];
  reviews = [];
  constructor() {
    this.init();
  }
  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
        this.products = data.products || [];
        this.categories = data.categories || [];
        this.users = data.users || [];
        this.orders = data.orders || [];
        this.coupons = data.coupons || [];
        this.reviews = data.reviews || [];
        if (this.reviews.length === 0) {
          this.seedReviews();
        }
        return;
      }
    } catch (e) {
      console.warn("Could not read existing database.json, seeding new data.", e);
    }
    this.seed();
    this.seedReviews();
    this.save();
  }
  seed() {
    this.categories = [
      {
        id: "cat-banarasi",
        name: "Banarasi Silk",
        slug: "banarasi-silk",
        description: "Centuries-old royal weaving from Varanasi with exquisite real zari motifs and timeless elegance.",
        image: "/src/assets/images/hero_banarasi_bridal_1791698980254.jpg",
        productCount: 14,
        tagline: "Imperial Majesty from Varanasi"
      },
      {
        id: "cat-kanjivaram",
        name: "Kanjivaram Silk",
        slug: "kanjivaram-silk",
        description: "Heirloom South Indian temple silks handwoven in Kanchipuram with pure mulberry threads.",
        image: "/src/assets/images/saree_kanjivaram_gold_1791698990300.jpg",
        productCount: 18,
        tagline: "Temple Zari & Heavy Brocade"
      },
      {
        id: "cat-chanderi",
        name: "Chanderi & Organza",
        slug: "chanderi-organza",
        description: "Feather-light sheer weaves from Madhya Pradesh adorned with golden buttis and pastel charm.",
        image: "/src/assets/images/saree_chanderi_pastel_1791699001746.jpg",
        productCount: 12,
        tagline: "Graceful Sheer Gossamer"
      },
      {
        id: "cat-georgette",
        name: "Georgette & Chiffon",
        slug: "georgette-chiffon",
        description: "Flowing contemporary drapes with delicate sequins, zari borders, and effortless pleats.",
        image: "/src/assets/images/saree_banarasi_blue_1791699014715.jpg",
        productCount: 16,
        tagline: "Modern Elegance in Motion"
      },
      {
        id: "cat-bridal",
        name: "Bridal Heritage",
        slug: "bridal-heritage",
        description: "Grand trousseau masterpieces featuring heavy hand zardosi, antique brocade, and vermillion hues.",
        image: "/src/assets/images/hero_banarasi_bridal_1791698980254.jpg",
        productCount: 9,
        tagline: "The Ultimate Wedding Legacy"
      },
      {
        id: "cat-cotton",
        name: "Handloom Cotton",
        slug: "handloom-cotton",
        description: "Breathable artisanal cottons, Jamdani, and linen weaves for mindful everyday royalty.",
        image: "/src/assets/images/saree_chanderi_pastel_1791699001746.jpg",
        productCount: 15,
        tagline: "Pure Comfort, Pure Craft"
      }
    ];
    this.products = [
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
        images: [
          "/src/assets/images/hero_banarasi_bridal_1791698980254.jpg",
          "/src/assets/images/saree_kanjivaram_gold_1791698990300.jpg"
        ],
        rating: 4.9,
        reviewsCount: 128,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        blousePieceIncluded: true,
        sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
        careInstructions: "Strictly dry clean only. Wrap in muslin cloth when storing.",
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
        images: [
          "/src/assets/images/saree_kanjivaram_gold_1791698990300.jpg",
          "/src/assets/images/hero_banarasi_bridal_1791698980254.jpg"
        ],
        rating: 5,
        reviewsCount: 94,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        blousePieceIncluded: true,
        sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
        careInstructions: "Dry clean only. Avoid spraying perfumes directly on zari.",
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
        description: "Whisper-light Chanderi tissue silk saree in ethereal blush rose pink. Featuring miniature gold ashrafi bootis scattered throughout with a soft scalloped zari border.",
        category: "chanderi-organza",
        fabric: "Chanderi",
        color: "Blush Rose Pink",
        colorHex: "#d89ba6",
        occasion: "Party Wear",
        stock: 14,
        sku: "SS-CHA-003",
        images: [
          "/src/assets/images/saree_chanderi_pastel_1791699001746.jpg",
          "/src/assets/images/saree_banarasi_blue_1791699014715.jpg"
        ],
        rating: 4.8,
        reviewsCount: 67,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        blousePieceIncluded: true,
        sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
        careInstructions: "Dry clean recommended. Gentle hand steam ironing.",
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
        description: "Drape in royal luxury with this midnight navy blue pure Banarasi georgette saree. Adorned with intricate antique silver floral jaal weaving and scalloped pallu borders.",
        category: "georgette-chiffon",
        fabric: "Georgette",
        color: "Royal Navy Blue & Silver",
        colorHex: "#14234b",
        occasion: "Party Wear",
        stock: 11,
        sku: "SS-GEO-004",
        images: [
          "/src/assets/images/saree_banarasi_blue_1791699014715.jpg",
          "/src/assets/images/hero_banarasi_bridal_1791698980254.jpg"
        ],
        rating: 4.9,
        reviewsCount: 82,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        blousePieceIncluded: true,
        sareeLength: "5.5 meters saree + 0.8 meter unstitched blouse piece",
        careInstructions: "Dry clean only.",
        specifications: {
          Weave: "Banarasi Khaddi Georgette",
          Zari: "Antique Silver Rupa Zari",
          Origin: "Varanasi, Uttar Pradesh",
          Weight: "620 grams",
          Blouse: "Navy brocade with matching border"
        },
        createdAt: "2026-09-25T10:00:00Z"
      }
    ];
    this.coupons = [
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
        description: "Welcome special: 10% off on your maiden ethnic order",
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
    this.users = [
      {
        id: "usr-customer-1",
        name: "Priyanka Sharma",
        email: "priyanka@sareesansar.com",
        password: "Customer@2026",
        phone: "9876543210",
        role: "customer",
        createdAt: "2026-08-15T09:00:00Z",
        addresses: [
          {
            id: "addr-1",
            fullName: "Priyanka Sharma",
            phone: "9876543210",
            pincode: "110001",
            state: "Delhi",
            city: "New Delhi",
            locality: "Connaught Place",
            addressLine: "Flat 402, Regalia Heights, Barakhamba Road",
            landmark: "Near Metro Gate 3",
            isDefault: true,
            type: "HOME"
          }
        ]
      },
      {
        id: "usr-admin-1",
        name: "Ananya Singhania (Store Manager)",
        email: "admin@sareesansar.com",
        password: "Admin@2026",
        phone: "9811122233",
        role: "admin",
        createdAt: "2026-01-01T00:00:00Z",
        addresses: []
      }
    ];
    this.orders = [
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
            product: this.products[0],
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
        shippingAddress: this.users[0].addresses[0],
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
  }
  seedReviews() {
    this.reviews = [
      {
        id: "rev-1",
        sareeId: "prod-1",
        userId: "usr-customer-1",
        userName: "Radhika Kulkarni",
        userEmail: "radhika.k@gmail.com",
        rating: 5,
        title: "Heirloom Masterpiece for My Wedding Trousseau!",
        comment: "Wore this Shahi Dulhan Banarasi saree for my royal reception in Varanasi. The pure Mulberry Katan silk is surprisingly light yet majestic, and the antique gold zardosi border glowed gracefully under the lights. Worth every rupee!",
        verifiedPurchase: true,
        helpfulVotes: 14,
        images: ["/src/assets/images/hero_banarasi_bridal_1791698980254.jpg"],
        createdAt: "2026-09-25T11:20:00Z"
      },
      {
        id: "rev-2",
        sareeId: "prod-1",
        userId: "usr-2",
        userName: "Meenakshi Sundaram",
        userEmail: "meenakshi.s@gmail.com",
        rating: 5,
        title: "Authentic Silk Mark Verified Pure Zari",
        comment: "Tested the silk threads and tested zari authenticity. The feel of handloom weave cannot be matched by powerlooms. Delivered in signature wooden luxury keepsake box with Silk Mark tag attached.",
        verifiedPurchase: true,
        helpfulVotes: 9,
        images: [],
        createdAt: "2026-10-02T16:45:00Z"
      },
      {
        id: "rev-3",
        sareeId: "prod-2",
        userId: "usr-3",
        userName: "Deepa Krishnan",
        userEmail: "deepa.k@yahoo.com",
        rating: 5,
        title: "Temple Korvai Border Perfection",
        comment: "The emerald green and ruby red temple contrast is breathtaking. The peacock (mayil) bootis are so sharp. Perfect for our family Karthigai Deepam pooja.",
        verifiedPurchase: true,
        helpfulVotes: 11,
        images: ["/src/assets/images/saree_kanjivaram_gold_1791698990300.jpg"],
        createdAt: "2026-09-28T09:15:00Z"
      },
      {
        id: "rev-4",
        sareeId: "prod-3",
        userId: "usr-4",
        userName: "Ananya Roy",
        userEmail: "ananya.roy@outlook.com",
        rating: 5,
        title: "Ethereal Blush Pink Chanderi",
        comment: "Feather-light drape! I was able to carry it for 8 hours without feeling any weight. The golden ashrafi bootis look so delicate and classy.",
        verifiedPurchase: true,
        helpfulVotes: 7,
        images: ["/src/assets/images/saree_chanderi_pastel_1791699001746.jpg"],
        createdAt: "2026-10-05T14:10:00Z"
      }
    ];
  }
  save() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(
        DB_FILE,
        JSON.stringify(
          {
            products: this.products,
            categories: this.categories,
            users: this.users,
            orders: this.orders,
            coupons: this.coupons,
            reviews: this.reviews
          },
          null,
          2
        ),
        "utf-8"
      );
    } catch (e) {
      console.error("Failed saving database.json", e);
    }
  }
}
export const db = new Database();
