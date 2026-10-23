import mongoose, { Schema } from "mongoose";
const SareeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Saree name is required"],
      trim: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, "Saree description is required"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"]
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    fabricType: {
      type: String,
      required: [true, "Fabric type is required"],
      index: true,
      trim: true
    },
    artisan: {
      type: String,
      required: [true, "Artisan or master weaver information is required"],
      default: "Heritage Handloom Guild, Varanasi Looms",
      trim: true
    },
    inventoryStatus: {
      type: String,
      enum: {
        values: ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "MADE_TO_ORDER"],
        message: "{VALUE} is not a valid inventory status"
      },
      default: "IN_STOCK",
      index: true
    },
    category: {
      type: String,
      required: true,
      index: true,
      default: "banarasi-silk"
    },
    color: {
      type: String,
      required: true,
      default: "Royal Crimson Maroon & Gold"
    },
    colorHex: {
      type: String,
      default: "#881930"
    },
    occasion: {
      type: String,
      default: "Bridal & Festive"
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    images: {
      type: [String],
      default: ["/src/assets/images/hero_banarasi_bridal_1791698980254.jpg"]
    },
    silkMarkCertified: {
      type: Boolean,
      default: true
    },
    zariType: {
      type: String,
      default: "Tested Pure Gold & Silver Zari"
    },
    blousePieceIncluded: {
      type: Boolean,
      default: true
    },
    sareeLength: {
      type: String,
      default: "5.5 meters saree + 0.8 meter blouse piece"
    },
    careInstructions: {
      type: String,
      default: "Dry clean only. Store in muslin cloth with cedar balls."
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 1
    },
    isFeatured: {
      type: Boolean,
      default: true
    },
    isBestSeller: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: true
    },
    specifications: {
      type: Map,
      of: String,
      default: {}
    }
  },
  {
    timestamps: true
  }
);
SareeSchema.pre("save", function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discountPercent = Math.round((this.originalPrice - this.price) / this.originalPrice * 100);
  }
  if (this.stock === 0) {
    this.inventoryStatus = "OUT_OF_STOCK";
  } else if (this.stock <= 5) {
    this.inventoryStatus = "LOW_STOCK";
  } else {
    this.inventoryStatus = "IN_STOCK";
  }
});
export const Saree = mongoose.models.Saree || mongoose.model("Saree", SareeSchema);
export default Saree;
