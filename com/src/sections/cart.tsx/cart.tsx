 "use client";

import Image from "next/image";
import Link from "next/link";
import {
  useState, useEffect, useRef,
  createContext, useContext, useCallback,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/Container";
import { products, categories, type Product, type Category } from "@/data/products";
import { useShopEntrance, useCategorySwitch, useCardHover, animateHeartAdd } from "./Animation";

// ─── Wishlist Context ─────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string; name: string; price: number; originalPrice?: number; image: string;
}
interface WishlistCtx {
  items: WishlistItem[]; count: number;
  add: (item: WishlistItem) => void; remove: (id: string) => void; has: (id: string) => boolean;
}
export const WishlistContext = createContext<WishlistCtx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window === "undefined") return [];
    try { const s = localStorage.getItem("wishlist"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(items)); }, [items]);
  const add    = useCallback((item: WishlistItem) => setItems((p) => p.some((i) => i.id === item.id) ? p : [item, ...p]), []);
  const remove = useCallback((id: string) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const has    = useCallback((id: string) => items.some((i) => i.id === id), [items]);
  return <WishlistContext.Provider value={{ items, count: items.length, add, remove, has }}>{children}</WishlistContext.Provider>;
}
export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

// ─── Cart Context ─────────────────────────────────────────────────────────────

export interface CartItem {
  id: string; name: string; price: number; originalPrice?: number; image: string; qty: number;
}
interface CartCtx {
  items: CartItem[]; count: number;
  add: (item: Omit<CartItem, "qty">) => void; remove: (id: string) => void; has: (id: string) => boolean;
}
export const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try { const s = localStorage.getItem("cart"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("cart", JSON.stringify(items)); }, [items]);
  const add = useCallback((item: Omit<CartItem, "qty">) => {
    setItems((p) => {
      const ex = p.find((i) => i.id === item.id);
      return ex ? p.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [{ ...item, qty: 1 }, ...p];
    });
  }, []);
  const remove = useCallback((id: string) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const has    = useCallback((id: string) => items.some((i) => i.id === id), [items]);
  return <CartContext.Provider value={{ items, count: items.reduce((s, i) => s + i.qty, 0), add, remove, has }}>{children}</CartContext.Provider>;
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// ─── Heart Button ─────────────────────────────────────────────────────────────

function HeartButton({ product }: { product: Product }) {
  const { add, remove, has } = useWishlist();
  const svgRef    = useRef<SVGSVGElement | null>(null);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  // flashing = تأثير مؤقت بس مش saved
  const [flashing, setFlashing] = useState(false);
  const isSaved = has(product.id);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      remove(product.id);
    } else {
      add({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
      });
      // شغّل تأثير الـ bounce
      if (svgRef.current) animateHeartAdd(svgRef.current);
      // فلاش أحمر مؤقت لمدة 700ms بس ميبقاش محفوظ بلون أحمر في الكارت
      setFlashing(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setFlashing(false), 600);
    }
  };

  // cleanup عند unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // لون القلب: لو flashing يبقى أحمر مؤقت، لو saved يبقى أحمر دايم، غير كده شفاف
  const isRed = flashing  

  return (
    <button
      onClick={toggle}
      aria-label="Toggle wishlist"
      className="
        absolute bottom-3 right-3 z-10
        w-9 h-9 rounded-full
        bg-white/75 backdrop-blur-sm
        flex items-center justify-center
        shadow-sm cursor-pointer
        hover:bg-white
        transition-colors duration-200
        will-change-transform
      "
    >
      <svg
        ref={svgRef}
        width="18" height="18" viewBox="0 0 24 24"
        fill={isRed ? "#E8192C" : "none"}
        stroke={isRed ? "#E8192C" : "#111111"}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: "fill 0.25s ease, stroke 0.25s ease", display: "block" }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

export function ProductCard({ product }: { product: Product }) {
  const cardRef   = useRef<HTMLAnchorElement | null>(null);
  const imageRef  = useRef<HTMLDivElement | null>(null);

  // Zoom بسيط على الصورة عند hover
  useEffect(() => {
    const card  = cardRef.current;
    const imgEl = imageRef.current;
    if (!card || !imgEl) return;

    const img = imgEl.querySelector("img") as HTMLImageElement | null;
    if (!img) return;

    img.style.transition = "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    img.style.willChange = "transform";

    const onEnter = () => { img.style.transform = "scale(1.06)"; };
    const onLeave = () => { img.style.transform = "scale(1)"; };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // الـ GSAP card hover (اللي كان موجود الأول)
  useCardHover(cardRef.current);

  const objectFit = product.fit === "contain" ? "object-contain p-4" : "object-cover";

  return (
    <Link ref={cardRef} href={`/product/${product.id}`} className="shop-card group relative block cursor-pointer">
      <div ref={imageRef} className="relative overflow-hidden bg-[#F5F4F2] aspect-[3/4]">
        <Image
          src={product.image} alt={product.name} fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`card-image ${objectFit} will-change-transform`}
        />
        <HeartButton product={product} />
      </div>
      <div className="card-info pt-3 pb-1 flex items-start justify-between gap-3 will-change-transform">
        <h3 className="font-[family-name:var(--font-inter)] text-[15px] sm:text-[16px] font-medium text-black leading-snug">
          {product.name}
        </h3>
        <div className="text-right shrink-0">
          {product.originalPrice ? (
            <div className="flex items-center gap-2 justify-end">
              <span className="font-[family-name:var(--font-inter)] text-[15px] font-semibold text-[#E8192C]">${product.price}</span>
              <span className="font-[family-name:var(--font-inter)] text-[13px] text-black/40 line-through">${product.originalPrice}</span>
            </div>
          ) : (
            <span className="font-[family-name:var(--font-inter)] text-[15px] text-black/70">${product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function ShopSection() {
  const searchParams = useSearchParams();

  const requestedCategory = searchParams.get("category")?.toUpperCase() as Category | null;
  const initialCategory: Category =
    requestedCategory && categories.includes(requestedCategory) ? requestedCategory : "MEN";

  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const filtered = products.filter((p) => p.category === activeCategory);

  const { sectionRef, labelRef, titleRef, navRef } = useShopEntrance();
  const { gridRef, animateSwitch, animateEnter }   = useCategorySwitch();

  const handleCategoryChange = useCallback((cat: Category) => {
    if (cat === activeCategory) return;
    animateSwitch();
    setTimeout(() => {
      setActiveCategory(cat);
      requestAnimationFrame(() => requestAnimationFrame(() => animateEnter()));
    }, 240);
  }, [activeCategory, animateSwitch, animateEnter]);

  useEffect(() => {
    const handler = (e: Event) => {
      const cat = (e as CustomEvent).detail as Category;
      if (cat) handleCategoryChange(cat);
    };
    window.addEventListener("set-category", handler);
    return () => window.removeEventListener("set-category", handler);
  }, [handleCategoryChange]);

  useEffect(() => {
    const cat = searchParams.get("category")?.toUpperCase() as Category | null;
    if (cat && categories.includes(cat)) {
      setActiveCategory(cat);
      window.history.replaceState({}, "", "/");
      if (sessionStorage.getItem("scrollToShop")) {
        sessionStorage.removeItem("scrollToShop");
        setTimeout(() => {
          const el = document.getElementById("shop");
          if (!el) return;
          const lenis = (window as any).lenis;
          if (lenis?.scrollTo) lenis.scrollTo(el, { offset: -80, duration: 1.2 });
          else el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="shop"
      className="w-full py-16 sm:py-20 lg:py-24 bg-white"
    >
      <Container>

        <div className="mb-10 sm:mb-12">
          <span ref={labelRef} className="font-[family-name:var(--font-inter)] text-label-sm text-black/40 tracking-[0.2em] uppercase will-change-[clip-path]">
            Collections
          </span>
          <h2 ref={titleRef} className="font-[family-name:var(--font-playfair)] text-headline-lg sm:text-[48px] text-black mt-2 leading-tight will-change-[clip-path]">
            Shop the Edit
          </h2>
        </div>

        <div ref={navRef} className="flex items-center justify-between border-b border-black/10 mb-10 will-change-[transform,opacity]">
          <div className="relative flex-1 min-w-0 sm:contents">
            <nav className="flex items-end gap-0 overflow-x-auto scrollbar-none">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const isSale   = cat === "SALE";
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`
                      relative px-5 py-3 font-[family-name:var(--font-inter)] text-label-sm
                      tracking-[0.12em] uppercase transition-colors duration-200 whitespace-nowrap cursor-pointer
                      ${isActive
                        ? isSale ? "text-[#E8192C]" : "text-black"
                        : isSale ? "text-[#E8192C]/50 hover:text-[#E8192C]" : "text-black/35 hover:text-black/65"}
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
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent sm:hidden" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center w-8 sm:hidden">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/50">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
          <span className="font-[family-name:var(--font-inter)] text-label-sm text-black/25 tracking-[0.1em] hidden sm:block pb-3 pl-4">
            {filtered.length} PIECES
          </span>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </Container>
    </section>
  );
}