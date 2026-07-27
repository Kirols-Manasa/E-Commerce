 "use client";

import Image from "next/image";
import { useState, createContext, useContext, useCallback, type ReactNode } from "react";
import Container from "@/Container";

// ─── Wishlist Context ─────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

interface WishlistCtx {
  items: WishlistItem[];
  count: number;
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
}

export const WishlistContext = createContext<WishlistCtx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const add = useCallback((item: WishlistItem) => {
    setItems((prev) => prev.some((i) => i.id === item.id) ? prev : [item, ...prev]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  return (
    <WishlistContext.Provider value={{ items, count: items.length, add, remove, has }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = "MEN" | "WOMEN" | "ACCESSORIES" | "SHOES" | "SALE";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category;
  fit?: "contain" | "cover";
}

// ─── Data ────────────────────────────────────────────────────────────────────

const products: Product[] = [
  // ── MEN ───────────────────────────────────────────────────────────────────
  { id: "men-7",   name: "Piqué Polo",              price: 175,  image: "/man/image7.png",          category: "MEN",         fit: "cover"   },
  { id: "men-3",   name: "Pleated Wide Trouser",    price: 420,  image: "/man/image3.png",          category: "MEN",         fit: "cover"   },
  { id: "men-5",   name: "Cotton Shirt Set",        price: 310,  image: "/man/image5.png",          category: "MEN",         fit: "cover"   },
  { id: "men-6",   name: "Relaxed Polo Shirt",      price: 195,  image: "/man/image6.png",          category: "MEN",         fit: "cover"   },
  { id: "men-2",   name: "Linen Resort Set",        price: 290,  image: "/man/image2.png",          category: "MEN",         fit: "cover"   },
  { id: "men-1",   name: "Wide Leg Denim",          price: 340,  image: "/man/image1.png",          category: "MEN",         fit: "cover"   },
  { id: "men-8",   name: "Essential Tee",           price: 95,   image: "/man/image8.png",          category: "MEN",         fit: "cover"   },
  { id: "men-4",   name: "Leather Duffel Bag",      price: 1850, image: "/man/image4.png",          category: "MEN",         fit: "cover"   },
  // ── WOMEN ─────────────────────────────────────────────────────────────────
  { id: "women-3", name: "Asymmetric Midi Skirt",   price: 310,  image: "/women/image3.png",        category: "WOMEN",       fit: "cover"   },
  { id: "women-8", name: "Satin Lounge Set",        price: 345,  image: "/women/image8.png",        category: "WOMEN",       fit: "cover"   },
  { id: "women-2", name: "Wide Linen Trouser",      price: 260,  image: "/women/image2.png",        category: "WOMEN",       fit: "cover"   },
  { id: "women-4", name: "Oversized Cotton Top",    price: 145,  image: "/women/image4.png",        category: "WOMEN",       fit: "cover"   },
  { id: "women-6", name: "Culotte Trousers",        price: 220,  image: "/women/image6.png",        category: "WOMEN",       fit: "cover"   },
  { id: "women-7", name: "Low Rise Straight Jean",  price: 290,  image: "/women/image7.png",        category: "WOMEN",       fit: "cover"   },
  { id: "women-5", name: "Ribbed Stripe Top",       price: 130,  image: "/women/image5.png",        category: "WOMEN",       fit: "cover"   },
  { id: "women-1", name: "Denim Cut-Off Short",     price: 185,  image: "/women/image1.png",        category: "WOMEN",       fit: "cover"   },
  // ── ACCESSORIES ───────────────────────────────────────────────────────────
  { id: "acc-6",   name: "Gold Body Chain",         price: 185,  image: "/Accessories/image6.png",  category: "ACCESSORIES", fit: "cover"   },
  { id: "acc-3",   name: "Silk Floral Hair Bow",    price: 55,   image: "/Accessories/image3.png",  category: "ACCESSORIES", fit: "contain" },
  { id: "acc-5",   name: "Butterfly Layer Necklace",price: 120,  image: "/Accessories/image5.png",  category: "ACCESSORIES", fit: "contain" },
  { id: "acc-2",   name: "Canvas Tote Bag",         price: 140,  image: "/Accessories/image2.png",  category: "ACCESSORIES", fit: "contain" },
  { id: "acc-1",   name: "Chain Waist Belt",        price: 95,   image: "/Accessories/image1.png",  category: "ACCESSORIES", fit: "cover"   },
  { id: "acc-4",   name: "Signature Sport Socks",   price: 35,   image: "/Accessories/image4.png",  category: "ACCESSORIES", fit: "contain" },
  // ── SHOES ─────────────────────────────────────────────────────────────────
  { id: "shoe-2",  name: "Classic Court Sneaker",   price: 280,  image: "/SHOES/image2.png",        category: "SHOES",       fit: "contain" },
  { id: "shoe-4",  name: "Low-Top Leather Sneaker", price: 260,  image: "/SHOES/image4.png",        category: "SHOES",       fit: "contain" },
  { id: "shoe-3",  name: "Technical Mesh Runner",   price: 295,  image: "/SHOES/image3.png",        category: "SHOES",       fit: "contain" },
  { id: "shoe-1",  name: "Chunky Trail Runner",     price: 320,  image: "/SHOES/image1.png",        category: "SHOES",       fit: "contain" },
  { id: "shoe-5",  name: "Air Cushion Sneaker",     price: 240,  image: "/SHOES/image5.png",        category: "SHOES",       fit: "contain" },
  { id: "shoe-6",  name: "Flame Edition Sneaker",   price: 310,  image: "/SHOES/image6.png",        category: "SHOES",       fit: "contain" },
  // ── SALE ──────────────────────────────────────────────────────────────────
  { id: "sale-4",  name: "Animal Knit Sweater",     price: 145,  originalPrice: 310, image: "/SALE/image4.png", category: "SALE", fit: "cover" },
  { id: "sale-6",  name: "Oversized Knit Sweater",  price: 110,  originalPrice: 240, image: "/SALE/image6.png", category: "SALE", fit: "cover" },
  { id: "sale-1",  name: "Cropped Tank Top",        price: 55,   originalPrice: 95,  image: "/SALE/image1.png", category: "SALE", fit: "cover" },
  { id: "sale-5",  name: "Utility Cargo Trouser",   price: 120,  originalPrice: 265, image: "/SALE/image5.png", category: "SALE", fit: "cover" },
  { id: "sale-2",  name: "Washed Cotton Tee",       price: 58,   originalPrice: 110, image: "/SALE/image2.png", category: "SALE", fit: "cover" },
  { id: "sale-3",  name: "Graphic Print Tee",       price: 62,   originalPrice: 130, image: "/SALE/image3.png", category: "SALE", fit: "cover" },
];

const categories: Category[] = ["MEN", "WOMEN", "ACCESSORIES", "SHOES", "SALE"];

// ─── Heart Button ─────────────────────────────────────────────────────────────

function HeartButton({ product }: { product: Product }) {
  const { add, remove } = useWishlist();
  const [burst, setBurst] = useState(false);
  const [showRed, setShowRed] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    setBurst(true);
    setShowRed(true);
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    });

    // البورست يرجع لحجمه الطبيعي بسرعة
    setTimeout(() => setBurst(false), 350);
    // اللون الأحمر يفضل شوية وبعدين يختفي (يرجع outline)
    setTimeout(() => setShowRed(false), 900);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Add to wishlist"
      className="
        absolute bottom-3 right-3 z-10
        w-9 h-9 rounded-full
        bg-white/75 backdrop-blur-sm
        flex items-center justify-center
        shadow-sm cursor-pointer
        opacity-100
        hover:bg-white
        transition-all duration-200
      "
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={showRed ? "#E8192C" : "none"}
        stroke={showRed ? "#E8192C" : "#111111"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: burst ? "scale(1.45)" : "scale(1)",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), fill 0.4s ease, stroke 0.4s ease",
        }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const objectFit = product.fit === "contain" ? "object-contain p-4" : "object-cover";

  return (
    <article className="group relative cursor-pointer">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-[#F5F4F2] aspect-[3/4]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`${objectFit} transition-transform duration-700 ease-in-out group-hover:scale-105`}
        />
        {/* ❤ Heart — bottom right */}
        <HeartButton product={product} />
      </div>

      {/* Product Info */}
      <div className="pt-3 pb-1 flex items-start justify-between gap-3">
        <h3 className="font-[family-name:var(--font-inter)] text-[15px] sm:text-[16px] font-medium text-black leading-snug">
          {product.name}
        </h3>
        <div className="text-right shrink-0">
          {product.originalPrice ? (
            <div className="flex items-center gap-2 justify-end">
              <span className="font-[family-name:var(--font-inter)] text-[15px] font-semibold text-[#E8192C]">
                ${product.price}
              </span>
              <span className="font-[family-name:var(--font-inter)] text-[13px] text-black/40 line-through">
                ${product.originalPrice}
              </span>
            </div>
          ) : (
            <span className="font-[family-name:var(--font-inter)] text-[15px] text-black/70">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("MEN");
  const filtered = products.filter((p) => p.category === activeCategory);

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-white">
      <Container>

        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <span className="font-[family-name:var(--font-inter)] text-label-sm text-black/40 tracking-[0.2em] uppercase">
            Collections
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-headline-lg sm:text-[48px] text-black mt-2 leading-tight">
            Shop the Edit
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-between border-b border-black/10 mb-10">

          <div className="relative flex-1 min-w-0 sm:contents">

            {/* Scrollable nav */}
            <nav className="flex items-end gap-0 overflow-x-auto scrollbar-none">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const isSale = cat === "SALE";
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      relative px-5 py-3 font-[family-name:var(--font-inter)] text-label-sm
                      tracking-[0.12em] uppercase transition-colors duration-200 whitespace-nowrap cursor-pointer
                      ${isActive
                        ? isSale ? "text-[#E8192C]" : "text-black"
                        : isSale ? "text-[#E8192C]/50 hover:text-[#E8192C]" : "text-black/35 hover:text-black/65"
                      }
                    `}
                  >
                    {cat}
                    <span className={`absolute bottom-0 left-0 right-0 h-[1.5px] transition-all duration-300
                      ${isActive ? "opacity-100" : "opacity-0"}
                      ${isSale ? "bg-[#E8192C]" : "bg-black"}`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Fade gradient — sm:hidden فقط */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute inset-y-0 right-0 w-10
                bg-gradient-to-l from-white to-transparent
                sm:hidden
              "
            />

            {/* Arrow hint — sm:hidden فقط */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute inset-y-0 right-0
                flex items-center justify-center
                w-8
                sm:hidden
              "
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black/50"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>

          </div>

          <span className="font-[family-name:var(--font-inter)] text-label-sm text-black/25 tracking-[0.1em] hidden sm:block pb-3 pl-4">
            {filtered.length} PIECES
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </Container>
    </section>
  );
}