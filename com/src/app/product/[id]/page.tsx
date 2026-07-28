 "use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/Container";
import { products, categories, type Category } from "@/data/products";
import { useWishlist, useCart, ProductCard } from "@/sections/cart.tsx/cart";

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#111111" : "none"} stroke="#111111" strokeWidth="1" opacity={filled ? 1 : 0.25}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
          </svg>
        );
      })}
    </div>
  );
}

// ─── Smooth Lens Zoom ─────────────────────────────────────────────────────────

function ZoomImage({ src, alt, fit }: { src: string; alt: string; fit?: "cover" | "contain" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [canZoom, setCanZoom] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setCanZoom(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCanZoom(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canZoom) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  const objectFitClass = fit === "contain" ? "object-contain p-6 sm:p-10" : "object-cover";

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseEnter={() => canZoom && setHovering(true)}
      onMouseLeave={() => canZoom && setHovering(false)}
      className={`relative flex-1 aspect-[4/5] bg-[#F7F6F4] overflow-hidden ${canZoom ? "cursor-zoom-in" : ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="55vw"
        priority
        className={objectFitClass}
        style={{
          transformOrigin: `${pos.x}% ${pos.y}%`,
          transform: canZoom && hovering ? "scale(1.6)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { add: addToWishlist, has: hasInWishlist } = useWishlist();
  const { add: addToCart, has: hasInCart } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [cartBurst, setCartBurst] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!pageRef.current) return;
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }
      );
    },
    { scope: pageRef, dependencies: [id] }
  );

  useEffect(() => {
    const lenis = (window as unknown as Record<string, any>).lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(0, { immediate: false, duration: 1 });
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id]);

  if (!product) {
    return (
      <Container>
        <div className="py-40 text-center text-black/50 font-[family-name:var(--font-inter)]">
          Product not found
        </div>
      </Container>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id);
  const gallery = product.images?.length ? product.images : [product.image];
  const otherCategories = categories.filter((c) => c !== product.category);
  const inWishlist = hasInWishlist(product.id);
  const inCart = hasInCart(product.id);

  const categoryLabel: Record<Category, string> = {
    MEN: "Men", WOMEN: "Women", SHOES: "Shoes", ACCESSORIES: "Accessories", SALE: "Sale",
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    });
    setCartBurst(true);
    setTimeout(() => setCartBurst(false), 350);
  };

  return (
    <>
      {/* ─── Continue Shopping — fixed جنب الهيدر ─── */}
      <Link
        href="/"
        className="group relative z-10 inline-flex items-center gap-2.5 mb-6 text-[12px] tracking-[0.15em] uppercase text-black/45 hover:text-black transition-colors font-[family-name:var(--font-inter)]"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Continue Shopping
      </Link>

      <section ref={pageRef} className="w-full bg-white">
       <Container className="pt-24 sm:pt-28 pb-24 sm:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-20">
            {/* ─── Gallery ─────────────────────────────── */}
            <div className="flex gap-4 sm:gap-5">
              <div className="flex flex-col gap-3 shrink-0">
                {gallery.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-14 h-[70px] sm:w-[68px] sm:h-[85px] overflow-hidden bg-[#F7F6F4] transition-opacity ${
                      activeImage === i ? "opacity-100 ring-1 ring-black" : "opacity-50 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className={product.fit === "contain" ? "object-contain p-1.5" : "object-cover"}
                    />
                  </button>
                ))}
              </div>

              <ZoomImage src={gallery[activeImage]} alt={product.name} fit={product.fit} />
            </div>

            {/* ─── Info ────────────────────────────────── */}
            <div className="max-w-md lg:pt-4">
              <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/35 tracking-[0.25em] uppercase">
                {categoryLabel[product.category]} Collection
              </span>

              <h1 className="font-[family-name:var(--font-playfair)] text-[38px] sm:text-[46px] text-black mt-3 leading-[1.08]">
                {product.name}
              </h1>

              {product.rating && (
                <div className="flex items-center gap-2.5 mt-4">
                  <StarRating rating={product.rating} />
                  <span className="text-[12px] text-black/40 font-[family-name:var(--font-inter)]">
                    {product.reviewCount} reviews
                  </span>
                </div>
              )}

              <div className="mt-6 flex items-baseline gap-3">
                {product.originalPrice ? (
                  <>
                    <span className="text-[22px] font-medium text-[#E8192C] font-[family-name:var(--font-inter)]">${product.price}</span>
                    <span className="text-[15px] text-black/35 line-through font-[family-name:var(--font-inter)]">${product.originalPrice}</span>
                  </>
                ) : (
                  <span className="text-[22px] font-medium text-black font-[family-name:var(--font-inter)]">${product.price}</span>
                )}
              </div>

              {product.description && (
                <p className="mt-6 text-[14px] leading-[1.8] text-black/55 font-[family-name:var(--font-inter)] max-w-[38ch]">
                  {product.description}
                </p>
              )}

              <div className="mt-10 h-px bg-black/8" />

              {product.colors && (
                <div className="mt-8">
                  <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/40 tracking-[0.2em] uppercase">
                    Color <span className="text-black/70 normal-case tracking-normal">— {product.colors[selectedColor].name}</span>
                  </span>
                  <div className="flex gap-2.5 mt-4">
                    {product.colors.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(i)}
                        className="relative w-9 h-9 rounded-full transition-transform hover:scale-105"
                        style={{ backgroundColor: c.hex, boxShadow: selectedColor === i ? "0 0 0 2px white, 0 0 0 3px #111" : "0 0 0 1px rgba(0,0,0,0.1)" }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && (
                <div className="mt-8">
                  <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/40 tracking-[0.2em] uppercase">
                    Size {selectedSize && <span className="text-black/70 normal-case tracking-normal">— {selectedSize}</span>}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[46px] px-3 py-2.5 border text-[12px] tracking-[0.05em] font-[family-name:var(--font-inter)] transition-colors ${
                          selectedSize === s
                            ? "border-black bg-black text-white"
                            : "border-black/15 text-black/60 hover:border-black/40"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center py-4 text-[12px] tracking-[0.2em] uppercase transition-colors font-[family-name:var(--font-inter)] cursor-pointer ${
                    inCart ? "bg-black/85 text-white" : "bg-black text-white hover:bg-black/85"
                  }`}
                  style={{
                    transform: cartBurst ? "scale(1.015)" : "scale(1)",
                    transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background-color 0.2s ease",
                  }}
                >
                  {inCart ? "Added to Cart" : "Add to Cart"}
                </button>

                <button
                  onClick={() =>
                    addToWishlist({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      image: product.image,
                    })
                  }
                  className="w-full flex items-center justify-center gap-2 py-4 text-[12px] tracking-[0.15em] uppercase text-black/50 hover:text-black border border-transparent hover:border-black/15 transition-all duration-300 font-[family-name:var(--font-inter)] cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={inWishlist ? "#E8192C" : "none"} stroke={inWishlist ? "#E8192C" : "currentColor"} strokeWidth="1.6">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {inWishlist ? "Saved" : "Save for Later"}
                </button>
              </div>
            </div>
          </div>

          {/* ─── More from this category ─── */}
          {related.length > 0 && (
            <div className="mt-16 sm:mt-20">
              <div className="flex items-baseline justify-between mb-10">
                <h2 className="font-[family-name:var(--font-playfair)] text-[26px] sm:text-[32px] text-black">
                  More {categoryLabel[product.category]}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* ─── Browse other categories ─── */}
          {otherCategories.map((cat) => {
            const catProducts = products.filter((p) => p.category === cat).slice(0, 4);
            if (catProducts.length === 0) return null;
            return (
              <div key={cat} className="mt-20 sm:mt-24">
                <div className="flex items-baseline justify-between mb-10">
                  <h2 className="font-[family-name:var(--font-playfair)] text-[26px] sm:text-[32px] text-black">
                    {categoryLabel[cat]}
                  </h2>
                  <Link
                    href={`/?category=${cat}`}
                    className="text-[11px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors font-[family-name:var(--font-inter)]"
                  >
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-6">
                  {catProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </Container>
      </section>
    </>
  );
}