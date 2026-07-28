 // src/data/products.ts
export type Category = "MEN" | "WOMEN" | "ACCESSORIES" | "SHOES" | "SALE";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: Category;
  fit?: "contain" | "cover";
  description?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  rating?: number;
  reviewCount?: number;
}

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];
const DEFAULT_COLORS = [
  { name: "Black", hex: "#111111" },
  { name: "Stone", hex: "#D8D3C9" },
  { name: "Charcoal", hex: "#3A3A3A" },
];

const DEFAULT_DESC =
  "A refined essential crafted from premium materials, balancing comfort and understated elegance for everyday wear.";

export const products: Product[] = [
  // ── MEN ──
  { id: "men-1", name: "Wide Leg Denim", price: 340, image: "/man/image1.png",
    images: ["/man/image1.png","/man/additional/man1/image.png","/man/additional/man1/image copy.png","/man/additional/man1/image copy 2.png"],
    category: "MEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.8, reviewCount: 42 },

  { id: "men-2", name: "Linen Resort Set", price: 290, image: "/man/image2.png",
    images: ["/man/image2.png","/man/additional/man2/image.png","/man/additional/man2/image copy.png","/man/additional/man2/image copy 2.png"],
    category: "MEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.6, reviewCount: 18 },

  { id: "men-3", name: "Pleated Wide Trouser", price: 420, image: "/man/image3.png",
    images: ["/man/image3.png","/man/additional/man3/image.png","/man/additional/man3/image copy.png","/man/additional/man3/image copy 2.png"],
    category: "MEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.9, reviewCount: 67 },

  { id: "men-4", name: "Leather Duffel Bag", price: 1850, image: "/man/image4.png",
    images: ["/man/image4.png","/man/additional/man4/image.png","/man/additional/man4/image copy.png","/man/additional/man4/image copy 2.png"],
    category: "MEN", fit: "cover", colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.5, reviewCount: 29 },

  { id: "men-5", name: "Cotton Shirt Set", price: 310, image: "/man/image5.png",
    images: ["/man/image5.png","/man/additional/man5/image.png","/man/additional/man5/image copy.png","/man/additional/man5/image copy 2.png"],
    category: "MEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.7, reviewCount: 53 },

  { id: "men-6", name: "Relaxed Polo Shirt", price: 195, image: "/man/image6.png",
    images: ["/man/image6.png","/man/additional/man6/image.png","/man/additional/man6/image copy.png","/man/additional/man6/image copy 2.png"],
    category: "MEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.6, reviewCount: 11 },

  { id: "men-7", name: "Piqué Polo", price: 175, image: "/man/image7.png",
    images: ["/man/image7.png","/man/additional/man7/image.png","/man/additional/man7/image copy.png","/man/additional/man7/image copy 2.png"],
    category: "MEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.8, reviewCount: 88 },

  { id: "men-8", name: "Essential Tee", price: 95, image: "/man/image8.png",
    images: ["/man/image8.png","/man/additional/man8/image.png","/man/additional/man8/image copy.png","/man/additional/man8/image copy 2.png"],
    category: "MEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.4, reviewCount: 24 },

  // ── WOMEN ──
  { id: "women-1", name: "Denim Cut-Off Short", price: 185, image: "/women/image1.png",
    images: ["/women/image1.png","/women/additional/women1/image.png","/women/additional/women1/image copy.png","/women/additional/women1/image copy 2.png"],
    category: "WOMEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.9, reviewCount: 36 },

  { id: "women-2", name: "Wide Linen Trouser", price: 260, image: "/women/image2.png",
    images: ["/women/image2.png","/women/additional/women2/image.png","/women/additional/women2/image copy.png","/women/additional/women2/image copy 2.png"],
    category: "WOMEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.7, reviewCount: 15 },

  { id: "women-3", name: "Asymmetric Midi Skirt", price: 310, image: "/women/image3.png",
    images: ["/women/image3.png","/women/additional/women3/image.png","/women/additional/women3/image copy.png","/women/additional/women3/image copy 2.png"],
    category: "WOMEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.5, reviewCount: 72 },

  { id: "women-4", name: "Oversized Cotton Top", price: 145, image: "/women/image4.png",
    images: ["/women/image4.png","/women/additional/women4/image.png","/women/additional/women4/image copy.png","/women/additional/women4/image copy 2.png"],
    category: "WOMEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.8, reviewCount: 44 },

  { id: "women-5", name: "Ribbed Stripe Top", price: 130, image: "/women/image5.png",
    images: ["/women/image5.png","/women/additional/women5/image.png","/women/additional/women5/image copy.png","/women/additional/women5/image copy 2.png"],
    category: "WOMEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.6, reviewCount: 19 },

  { id: "women-6", name: "Culotte Trousers", price: 220, image: "/women/image6.png",
    images: ["/women/image6.png","/women/additional/women6/image.png","/women/additional/women6/image copy.png","/women/additional/women6/image copy 2.png"],
    category: "WOMEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.9, reviewCount: 61 },

  { id: "women-7", name: "Low Rise Straight Jean", price: 290, image: "/women/image7.png",
    images: ["/women/image7.png","/women/additional/women7/image.png","/women/additional/women7/image copy.png","/women/additional/women7/image copy 2.png"],
    category: "WOMEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.7, reviewCount: 27 },

  { id: "women-8", name: "Satin Lounge Set", price: 345, image: "/women/image8.png",
    images: ["/women/image8.png","/women/additional/women8/image.png","/women/additional/women8/image copy.png","/women/additional/women8/image copy 2.png"],
    category: "WOMEN", fit: "cover", sizes: DEFAULT_SIZES, colors: DEFAULT_COLORS, description: DEFAULT_DESC, rating: 4.5, reviewCount: 9 },

  // ── ACCESSORIES ──
{ id: "acc-1", name: "Chain Waist Belt", price: 95, image: "/Accessories/image1.png",
  images: ["/Accessories/image1.png", "/Accessories/additional/1Accessories/image.png"],
  category: "ACCESSORIES", fit: "cover", description: DEFAULT_DESC, rating: 4.6, reviewCount: 55 },
{ id: "acc-2", name: "Canvas Tote Bag", price: 140, image: "/Accessories/image2.png",
  images: ["/Accessories/image2.png", "/Accessories/additional/2Accessories/image.png"],
  category: "ACCESSORIES", fit: "contain", description: DEFAULT_DESC, rating: 4.8, reviewCount: 31 },
{ id: "acc-3", name: "Silk Floral Hair Bow", price: 55, image: "/Accessories/image3.png",
  images: ["/Accessories/image3.png", "/Accessories/additional/3Accessories/image.png"],
  category: "ACCESSORIES", fit: "contain", description: DEFAULT_DESC, rating: 4.5, reviewCount: 8 },
{ id: "acc-4", name: "Signature Sport Socks", price: 35, image: "/Accessories/image4.png",
  images: ["/Accessories/image4.png", "/Accessories/additional/4Accessories/image.png"],
  category: "ACCESSORIES", fit: "contain", description: DEFAULT_DESC, rating: 4.9, reviewCount: 46 },
{ id: "acc-5", name: "Butterfly Layer Necklace", price: 120, image: "/Accessories/image5.png",
  images: ["/Accessories/image5.png", "/Accessories/additional/5Accessories/image.png"],
  category: "ACCESSORIES", fit: "contain", description: DEFAULT_DESC, rating: 4.7, reviewCount: 22 },
{ id: "acc-6", name: "Gold Body Chain", price: 185, image: "/Accessories/image6.png",
  images: ["/Accessories/image6.png", "/Accessories/additional/6Accessories/image.png"],
  category: "ACCESSORIES", fit: "cover", description: DEFAULT_DESC, rating: 4.6, reviewCount: 63 },

  // ── SHOES ── (صورة إضافية واحدة لكل واحد)
  { id: "shoe-1", name: "Chunky Trail Runner", price: 320, image: "/SHOES/image1.png",
    images: ["/SHOES/image1.png","/SHOES/additional/SHOES1/image.png"], category: "SHOES", fit: "contain", sizes: ["38","39","40","41","42","43","44"], description: DEFAULT_DESC, rating: 4.8, reviewCount: 17 },
  { id: "shoe-2", name: "Classic Court Sneaker", price: 280, image: "/SHOES/image2.png",
    images: ["/SHOES/image2.png","/SHOES/additional/SHOES2/image.png"], category: "SHOES", fit: "contain", sizes: ["38","39","40","41","42","43","44"], description: DEFAULT_DESC, rating: 4.5, reviewCount: 39 },
  { id: "shoe-3", name: "Technical Mesh Runner", price: 295, image: "/SHOES/image3.png",
    images: ["/SHOES/image3.png","/SHOES/additional/SHOES3/image.png"], category: "SHOES", fit: "contain", sizes: ["38","39","40","41","42","43","44"], description: DEFAULT_DESC, rating: 4.6, reviewCount: 12 },
  { id: "shoe-4", name: "Low-Top Leather Sneaker", price: 260, image: "/SHOES/image4.png",
    images: ["/SHOES/image4.png","/SHOES/additional/SHOES4/image.png"], category: "SHOES", fit: "contain", sizes: ["38","39","40","41","42","43","44"], description: DEFAULT_DESC, rating: 4.7, reviewCount: 58 },
  { id: "shoe-5", name: "Air Cushion Sneaker", price: 240, image: "/SHOES/image5.png",
    images: ["/SHOES/image5.png","/SHOES/additional/SHOES5/image.png"], category: "SHOES", fit: "contain", sizes: ["38","39","40","41","42","43","44"], description: DEFAULT_DESC, rating: 4.9, reviewCount: 33 },
  { id: "shoe-6", name: "Flame Edition Sneaker", price: 310, image: "/SHOES/image6.png",
    images: ["/SHOES/image6.png","/SHOES/additional/SHOES6/image.png"], category: "SHOES", fit: "contain", sizes: ["38","39","40","41","42","43","44"], description: DEFAULT_DESC, rating: 4.8, reviewCount: 21 },

  // ── SALE ── (صورة إضافية واحدة لكل واحد)
  { id: "sale-1", name: "Cropped Tank Top", price: 55, originalPrice: 95, image: "/SALE/image1.png",
    images: ["/SALE/image1.png","/SALE/additional/SALE1/image.png"], category: "SALE", fit: "cover", sizes: DEFAULT_SIZES, description: DEFAULT_DESC, rating: 4.5, reviewCount: 47 },
  { id: "sale-2", name: "Washed Cotton Tee", price: 58, originalPrice: 110, image: "/SALE/image2.png",
    images: ["/SALE/image2.png","/SALE/additional/SALE2/image.png"], category: "SALE", fit: "cover", sizes: DEFAULT_SIZES, description: DEFAULT_DESC, rating: 4.6, reviewCount: 6 },
  { id: "sale-3", name: "Graphic Print Tee", price: 62, originalPrice: 130, image: "/SALE/image3.png",
    images: ["/SALE/image3.png","/SALE/additional/SALE3/image.png"], category: "SALE", fit: "cover", sizes: DEFAULT_SIZES, description: DEFAULT_DESC, rating: 4.7, reviewCount: 26 },
  { id: "sale-4", name: "Animal Knit Sweater", price: 145, originalPrice: 310, image: "/SALE/image4.png",
    images: ["/SALE/image4.png","/SALE/additional/SALE4/image.png"], category: "SALE", fit: "cover", sizes: DEFAULT_SIZES, description: DEFAULT_DESC, rating: 4.8, reviewCount: 14 },
  { id: "sale-5", name: "Utility Cargo Trouser", price: 120, originalPrice: 265, image: "/SALE/image5.png",
    images: ["/SALE/image5.png","/SALE/additional/SALE5/image.png"], category: "SALE", fit: "cover", sizes: DEFAULT_SIZES, description: DEFAULT_DESC, rating: 4.9, reviewCount: 41 },
  { id: "sale-6", name: "Oversized Knit Sweater", price: 110, originalPrice: 240, image: "/SALE/image6.png",
    images: ["/SALE/image6.png","/SALE/additional/SALE6/image.png"], category: "SALE", fit: "cover", sizes: DEFAULT_SIZES, description: DEFAULT_DESC, rating: 4.6, reviewCount: 19 },
];

export const categories: Category[] = ["MEN", "WOMEN", "ACCESSORIES", "SHOES", "SALE"];