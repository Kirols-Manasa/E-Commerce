 "use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/Container";
import { products, categories, type Category } from "@/data/products";
import { useWishlist, useCart, ProductCard } from "@/sections/cart.tsx/cart";
import { triggerShowHeader } from "@/layout/Header/HeaderAnimation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function splitIntoWordSpans(el: HTMLElement): HTMLElement[] {
  const words = el.innerText.split(/\s+/);
  el.innerHTML = words
    .map(
      (w) =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;">` +
        `<span style="display:inline-block;">${w}</span></span>`
    )
    .join(" ");
  return Array.from(el.querySelectorAll("span > span")) as HTMLElement[];
}

// ─── Micro-interactions ───────────────────────────────────────────────────────

function animateCartBurst(btn: HTMLElement) {
  gsap.timeline()
    .to(btn, { scale: 0.97, duration: 0.1, ease: "power2.in" })
    .to(btn, { scale: 1,    duration: 0.3, ease: "power3.out" });
}

function animateWishlistToggle(heart: SVGElement, isNowSaved: boolean) {
  if (isNowSaved) {
    gsap.timeline()
      .to(heart, { scale: 1.3,  duration: 0.15, ease: "power2.out" })
      .to(heart, { scale: 1,    duration: 0.25, ease: "power3.out" });
    gsap.to(heart, { fill: "#E8192C", stroke: "#E8192C", duration: 0.2 });
  } else {
    gsap.to(heart, { fill: "none", stroke: "currentColor", scale: 1, duration: 0.2 });
  }
}

function animateImageSwitch(imgEl: HTMLImageElement, onSwap: () => void) {
  gsap.to(imgEl, {
    opacity: 0, scale: 1.03, duration: 0.18, ease: "power2.in",
    onComplete: () => {
      onSwap();
      requestAnimationFrame(() =>
        gsap.to(imgEl, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" })
      );
    },
  });
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? "#111111" : "none"}
          stroke="#111111" strokeWidth="1"
          opacity={i < Math.round(rating) ? 1 : 0.25}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Zoom Image ───────────────────────────────────────────────────────────────

function ZoomImage({ src, alt, fit, imgRef }: {
  src: string; alt: string;
  fit?: "cover" | "contain";
  imgRef?: React.RefObject<HTMLImageElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalRef  = useRef<HTMLImageElement>(null);
  const resolvedRef  = (imgRef ?? internalRef) as React.RefObject<HTMLImageElement>;
  const hoveringRef  = useRef(false);
  const posRef       = useRef({ x: 50, y: 50 });
  const exitPosRef   = useRef({ x: 50, y: 50 });
  const [canZoom, setCanZoom] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setCanZoom(mq.matches);
    const h = (e: MediaQueryListEvent) => setCanZoom(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const getRelativePos = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return { x: 50, y: 50 };
    return {
      x: ((e.clientX - r.left) / r.width)  * 100,
      y: ((e.clientY - r.top)  / r.height) * 100,
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!canZoom || !hoveringRef.current) return;
    const pos = getRelativePos(e);
    posRef.current = pos;
    const img = resolvedRef.current;
    if (img) {
      img.style.transformOrigin = `${pos.x}% ${pos.y}%`;
    }
  }, [canZoom, resolvedRef, getRelativePos]);

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!canZoom) return;
    const pos = getRelativePos(e);
    posRef.current = pos;
    hoveringRef.current = true;
    const img = resolvedRef.current;
    if (!img) return;
    // ابدأ الزوم من نقطة الدخول فوراً
    img.style.transition = "transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)";
    img.style.transformOrigin = `${pos.x}% ${pos.y}%`;
    img.style.transform = "scale(1.4)";
  }, [canZoom, resolvedRef, getRelativePos]);

  const handlePointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!hoveringRef.current) return;
    hoveringRef.current = false;
    const pos = getRelativePos(e);
    exitPosRef.current = pos;
    const img = resolvedRef.current;
    if (!img) return;
    // اخرج من نفس نقطة الخروج
    img.style.transition = "transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)";
    img.style.transformOrigin = `${pos.x}% ${pos.y}%`;
    img.style.transform = "scale(1)";
  }, [resolvedRef, getRelativePos]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative flex-1 aspect-[4/5] bg-[#F7F6F4] overflow-hidden ${canZoom ? "cursor-crosshair" : ""}`}
    >
      <Image
        ref={resolvedRef}
        src={src} alt={alt} fill sizes="55vw" priority
        className={fit === "contain" ? "object-contain p-6 sm:p-10" : "object-cover"}
        style={{
          transformOrigin: "50% 50%",
          transform: "scale(1)",
          transition: "transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      />
    </div>
  );
}

// ─── Back Button ─────────────────────────────────────────────────────────────

function BackButton() {
  return (
    <Link
      href="/"
      className="
        group inline-flex items-center gap-2
        font-[family-name:var(--font-inter)]
        text-[11px] tracking-[0.15em] uppercase
        text-black/40 hover:text-black
        transition-colors duration-200
        mb-8
      "
    >
      <svg
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        className="transition-transform duration-200 group-hover:-translate-x-1"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      Back to Shop
    </Link>
  );
}

// ─── Product Page ─────────────────────────────────────────────────────────────

export default function ProductPage() {
  const { id }  = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { add: addToWishlist, has: hasInWishlist } = useWishlist();
  const { add: addToCart,     has: hasInCart }     = useCart();

  const [activeImage,   setActiveImage]   = useState(0);
  const [selectedSize,  setSelectedSize]  = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);

  // refs
  const mainImageWrapRef    = useRef<HTMLDivElement>(null);
  const mainImgElRef        = useRef<HTMLImageElement>(null);
  const thumbsRef           = useRef<HTMLDivElement>(null);
  const categoryLabelRef    = useRef<HTMLSpanElement>(null);
  const h1Ref               = useRef<HTMLHeadingElement>(null);
  const starsRef            = useRef<HTMLDivElement>(null);
  const priceRef            = useRef<HTMLDivElement>(null);
  const dividerRef          = useRef<HTMLDivElement>(null);
  const descriptionRef      = useRef<HTMLParagraphElement>(null);
  const colorsWrapRef       = useRef<HTMLDivElement>(null);
  const sizesWrapRef        = useRef<HTMLDivElement>(null);
  const cartBtnRef          = useRef<HTMLButtonElement>(null);
  const wishlistBtnRef      = useRef<HTMLButtonElement>(null);
  const relatedSectionRef   = useRef<HTMLDivElement>(null);
  const otherSectionsRef    = useRef<HTMLDivElement>(null);

  // ── Animations ────────────────────────────────────────────────────────────
  useEffect(() => {
    ScrollTrigger.getAll().forEach((st) => st.kill());

    const E = "power3.out";

    // ── L2: Main Image ────────────────────────────────────────────────────
    const wrap = mainImageWrapRef.current;
    const img  = mainImgElRef.current;
    if (wrap) {
      gsap.set(wrap, { clipPath: "inset(0 0 100% 0)" });
      if (img) gsap.set(img, { scale: 1.06 });
      gsap.to(wrap, { clipPath: "inset(0 0 0% 0)", duration: 0.9, delay: 0.1, ease: E });
      if (img) gsap.to(img, { scale: 1, duration: 1.0, delay: 0.1, ease: E });
    }

    // ── L3: Thumbnails ────────────────────────────────────────────────────
    const thumbWrap = thumbsRef.current;
    if (thumbWrap) {
      const thumbs = Array.from(thumbWrap.querySelectorAll("button"));
      gsap.set(thumbs, { scaleY: 0, transformOrigin: "bottom center", opacity: 0 });
      gsap.to(thumbs, {
        scaleY: 1, opacity: 1,
        duration: 0.6, delay: 0.15,
        stagger: { each: 0.06, from: "end" },
        ease: E,
      });
    }

    // ── L4: Category Label ────────────────────────────────────────────────
    const cat = categoryLabelRef.current;
    if (cat) {
      gsap.set(cat, { opacity: 0, x: -10 });
      gsap.to(cat, { opacity: 1, x: 0, duration: 0.5, delay: 0.4, ease: E });
    }

    // ── L5: H1 words ─────────────────────────────────────────────────────
    const h1 = h1Ref.current;
    if (h1) {
      const spans = splitIntoWordSpans(h1);
      gsap.set(spans, { y: 32, opacity: 0 });
      gsap.to(spans, { y: 0, opacity: 1, duration: 0.65, delay: 0.5, stagger: 0.06, ease: E });
    }

    // ── L6: Stars ─────────────────────────────────────────────────────────
    const starsWrap = starsRef.current;
    if (starsWrap) {
      const stars = Array.from(starsWrap.querySelectorAll("svg"));
      const rev   = starsWrap.querySelector("span");
      gsap.set(stars, { scale: 0, opacity: 0 });
      gsap.to(stars, { scale: 1, opacity: 1, duration: 0.4, delay: 0.7, stagger: 0.05, ease: "back.out(1.3)" });
      if (rev) {
        gsap.set(rev, { opacity: 0, x: 5 });
        gsap.to(rev, { opacity: 1, x: 0, duration: 0.35, delay: 0.95, ease: E });
      }
    }

    // ── L7: Price ─────────────────────────────────────────────────────────
    const price     = priceRef.current;
    const salePrice = price?.querySelector("[data-sale-price]") as HTMLElement | null;
    if (price) {
      gsap.set(price, { opacity: 0, y: 10 });
      gsap.to(price, { opacity: 1, y: 0, duration: 0.55, delay: 0.8, ease: E });
      if (salePrice) {
        gsap.set(salePrice, { color: "#888888" });
        gsap.to(salePrice, { color: "#E8192C", duration: 0.5, delay: 0.95, ease: E });
      }
    }

    // ── L8: Divider ───────────────────────────────────────────────────────
    const div = dividerRef.current;
    if (div) {
      gsap.set(div, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(div, { scaleX: 1, duration: 0.55, delay: 0.9, ease: E });
    }

    // ── L9: Description ───────────────────────────────────────────────────
    const desc = descriptionRef.current;
    if (desc) {
      gsap.set(desc, { opacity: 0, y: 12 });
      gsap.to(desc, { opacity: 1, y: 0, duration: 0.6, delay: 1.0, ease: E });
    }

    // ── L10a: Color Swatches ──────────────────────────────────────────────
    const colWrap = colorsWrapRef.current;
    if (colWrap) {
      const sw = Array.from(colWrap.querySelectorAll("button"));
      gsap.set(sw, { scale: 0, opacity: 0 });
      gsap.to(sw, { scale: 1, opacity: 1, duration: 0.4, delay: 1.1, stagger: 0.05, ease: "back.out(1.2)" });
    }

    // ── L10b: Size Buttons ────────────────────────────────────────────────
    const sizeWrap = sizesWrapRef.current;
    if (sizeWrap) {
      const btns = Array.from(sizeWrap.querySelectorAll("button"));
      gsap.set(btns, { opacity: 0, y: 8 });
      gsap.to(btns, { opacity: 1, y: 0, duration: 0.4, delay: 1.15, stagger: 0.035, ease: E });
    }

    // ── L11: CTA Buttons ─────────────────────────────────────────────────
    const cartBtn  = cartBtnRef.current;
    const wishBtn  = wishlistBtnRef.current;
    if (cartBtn) {
      gsap.set(cartBtn, { opacity: 0, y: 14 });
      gsap.to(cartBtn, { opacity: 1, y: 0, duration: 0.55, delay: 1.25, ease: E });
    }
    if (wishBtn) {
      gsap.set(wishBtn, { opacity: 0, y: 10 });
      gsap.to(wishBtn, { opacity: 1, y: 0, duration: 0.45, delay: 1.35, ease: E });
    }

    // ── SCROLL: Related ───────────────────────────────────────────────────
    const related = relatedSectionRef.current;
    if (related) {
      const header = related.querySelector("h2") as HTMLElement | null;
      const cards  = Array.from(related.querySelectorAll("[data-product-card]")) as HTMLElement[];

      if (header) {
        gsap.set(header, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: header, start: "top 88%", once: true,
          onEnter: () => gsap.to(header, { opacity: 1, y: 0, duration: 0.6, ease: E }),
        });
      }
      cards.forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 30 });
        ScrollTrigger.create({
          trigger: card, start: "top 92%", once: true,
          onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.55, delay: i * 0.05, ease: E }),
        });
      });
    }

    // ── SCROLL: Other Categories ──────────────────────────────────────────
    const others = otherSectionsRef.current;
    if (others) {
      const sections = Array.from(others.querySelectorAll("[data-category-section]")) as HTMLElement[];
      sections.forEach((section) => {
        const header  = section.querySelector("h2") as HTMLElement | null;
        const viewAll = section.querySelector("[data-view-all]") as HTMLElement | null;
        const cards   = Array.from(section.querySelectorAll("[data-product-card]")) as HTMLElement[];

        if (header) {
          gsap.set(header, { opacity: 0, y: 20 });
          ScrollTrigger.create({
            trigger: header, start: "top 88%", once: true,
            onEnter: () => gsap.to(header, { opacity: 1, y: 0, duration: 0.6, ease: E }),
          });
        }
        if (viewAll) {
          gsap.set(viewAll, { opacity: 0, x: 12 });
          ScrollTrigger.create({
            trigger: viewAll, start: "top 88%", once: true,
            onEnter: () => gsap.to(viewAll, { opacity: 1, x: 0, duration: 0.45, ease: E }),
          });
        }
        cards.forEach((card, i) => {
          gsap.set(card, { opacity: 0, y: 30 });
          ScrollTrigger.create({
            trigger: card, start: "top 92%", once: true,
            onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.55, delay: i * 0.05, ease: E }),
          });
        });
      });
    }

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, [id]);

  // ── Scroll to top ─────────────────────────────────────────────────────────
  useEffect(() => {
    const lenis = (window as unknown as Record<string, any>).lenis;
    if (lenis?.scrollTo) lenis.scrollTo(0, { immediate: false, duration: 1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImage(0);
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

  const related         = products.filter((p) => p.category === product.category && p.id !== product.id);
  const gallery         = product.images?.length ? product.images : [product.image];
  const otherCategories = categories.filter((c) => c !== product.category);
  const inWishlist      = hasInWishlist(product.id);
  const inCart          = hasInCart(product.id);

  const categoryLabel: Record<Category, string> = {
    MEN: "Men", WOMEN: "Women", SHOES: "Shoes", ACCESSORIES: "Accessories", SALE: "Sale",
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id, name: product.name,
      price: product.price, originalPrice: product.originalPrice,
      image: product.image,
    });
    if (cartBtnRef.current) animateCartBurst(cartBtnRef.current);
    triggerShowHeader();
  };

  const handleWishlist = () => {
    addToWishlist({
      id: product.id, name: product.name,
      price: product.price, originalPrice: product.originalPrice,
      image: product.image,
    });
    const heart = wishlistBtnRef.current?.querySelector("svg");
    if (heart) animateWishlistToggle(heart as SVGElement, !inWishlist);
    triggerShowHeader();
  };

  const handleThumbnailClick = (index: number) => {
    if (index === activeImage) return;
    if (mainImgElRef.current) animateImageSwitch(mainImgElRef.current, () => setActiveImage(index));
    else setActiveImage(index);
  };

  return (
    <>
      <section className="w-full bg-white">
        <Container className="pt-24 sm:pt-28 pb-24 sm:pb-32">

          {/* ── زرار الرجوع ── */}
          <BackButton />

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-20">

            {/* Gallery */}
            <div className="flex gap-4 sm:gap-5">

              {/* Thumbnails — غامقة افتراضياً، تتفتح عند الـ hover أو لو active */}
              <div ref={thumbsRef} className="flex flex-col gap-3 shrink-0">
                {gallery.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => handleThumbnailClick(i)}
                    className="relative w-14 h-[70px] sm:w-[68px] sm:h-[85px] overflow-hidden bg-[#F7F6F4] transition-all duration-300"
                    style={{
                      opacity: 0,
                      filter: activeImage === i ? "brightness(1)" : "brightness(0.)",
                      outline: activeImage === i ? "1px solid #111" : "none",
                      outlineOffset: "0px",
                    }}
                    onMouseEnter={(e) => {
                      if (activeImage !== i) {
                        (e.currentTarget as HTMLElement).style.filter = "brightness(1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeImage !== i) {
                     
                      }
                    }}
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

              {/* Main Image */}
              <div ref={mainImageWrapRef} className="relative flex-1" style={{ clipPath: "inset(0 0 100% 0)" }}>
                <ZoomImage
                  src={gallery[activeImage] ?? product.image}
                  alt={product.name}
                  fit={product.fit}
                  imgRef={mainImgElRef}
                />
              </div>
            </div>

            {/* Info */}
            <div className="max-w-md lg:pt-4">
              <span ref={categoryLabelRef}
                className="font-[family-name:var(--font-inter)] text-[11px] text-black/35 tracking-[0.25em] uppercase"
                style={{ opacity: 0, display: "inline-block" }}>
                {categoryLabel[product.category]} Collection
              </span>

              <h1 ref={h1Ref}
                className="font-[family-name:var(--font-playfair)] text-[38px] sm:text-[46px] text-black mt-3 leading-[1.08]">
                {product.name}
              </h1>

              {product.rating && (
                <div ref={starsRef} className="flex items-center gap-2.5 mt-4">
                  <StarRating rating={product.rating} />
                  <span className="text-[12px] text-black/40 font-[family-name:var(--font-inter)]">
                    {product.reviewCount} reviews
                  </span>
                </div>
              )}

              <div ref={priceRef} className="mt-6 flex items-baseline gap-3" style={{ opacity: 0 }}>
                {product.originalPrice ? (
                  <>
                    <span data-sale-price
                      className="text-[22px] font-medium font-[family-name:var(--font-inter)]"
                      style={{ color: "#888888" }}>
                      ${product.price}
                    </span>
                    <span className="text-[15px] text-black/35 line-through font-[family-name:var(--font-inter)]">
                      ${product.originalPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-[22px] font-medium text-black font-[family-name:var(--font-inter)]">
                    ${product.price}
                  </span>
                )}
              </div>

              {product.description && (
                <p ref={descriptionRef}
                  className="mt-6 text-[14px] leading-[1.8] text-black/55 font-[family-name:var(--font-inter)] max-w-[38ch]"
                  style={{ opacity: 0 }}>
                  {product.description}
                </p>
              )}

              <div ref={dividerRef} className="mt-10 h-px bg-black/8"
                style={{ transform: "scaleX(0)", transformOrigin: "left center" }} />

              {product.colors && (
                <div className="mt-8">
                  <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/40 tracking-[0.2em] uppercase">
                    Color <span className="text-black/70 normal-case tracking-normal">— {product.colors?.[selectedColor]?.name}</span>
                  </span>
                  <div ref={colorsWrapRef} className="flex gap-2.5 mt-4">
                    {product.colors.map((c, i) => (
                      <button key={c.name} onClick={() => setSelectedColor(i)}
                        className="relative w-9 h-9 rounded-full transition-transform hover:scale-105"
                        style={{
                          backgroundColor: c.hex,
                          boxShadow: selectedColor === i ? "0 0 0 2px white, 0 0 0 3px #111" : "0 0 0 1px rgba(0,0,0,0.1)",
                          opacity: 0, transform: "scale(0)",
                        }}
                        title={c.name} />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && (
                <div className="mt-8">
                  <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/40 tracking-[0.2em] uppercase">
                    Size {selectedSize && <span className="text-black/70 normal-case tracking-normal">— {selectedSize}</span>}
                  </span>
                  <div ref={sizesWrapRef} className="flex flex-wrap gap-2 mt-4">
                    {product.sizes.map((s) => (
                      <button key={s} onClick={() => setSelectedSize(s)}
                        className={`min-w-[46px] px-3 py-2.5 border text-[12px] tracking-[0.05em] font-[family-name:var(--font-inter)] transition-colors ${
                          selectedSize === s ? "border-black bg-black text-white" : "border-black/15 text-black/60 hover:border-black/40"
                        }`}
                        style={{ opacity: 0 }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 flex flex-col gap-3">
                <button ref={cartBtnRef} onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center py-4 text-[12px] tracking-[0.2em] uppercase font-[family-name:var(--font-inter)] cursor-pointer transition-colors ${
                    inCart ? "bg-black/85 text-white" : "bg-black text-white hover:bg-black/85"
                  }`}
                  style={{ opacity: 0 }}>
                  {inCart ? "Added to Cart" : "Add to Cart"}
                </button>

                <button ref={wishlistBtnRef} onClick={handleWishlist}
                  className="w-full flex items-center justify-center gap-2 py-4 text-[12px] tracking-[0.15em] uppercase text-black/50 hover:text-black border border-transparent hover:border-black/15 transition-all duration-300 font-[family-name:var(--font-inter)] cursor-pointer"
                  style={{ opacity: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24"
                    fill={inWishlist ? "#E8192C" : "none"}
                    stroke={inWishlist ? "#E8192C" : "currentColor"} strokeWidth="1.6">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {inWishlist ? "Saved" : "Save for Later"}
                </button>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div ref={relatedSectionRef} className="mt-16 sm:mt-20">
              <div className="flex items-baseline justify-between mb-10">
                <h2 className="font-[family-name:var(--font-playfair)] text-[26px] sm:text-[32px] text-black"
                  style={{ opacity: 0 }}>
                  More {categoryLabel[product.category]}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-6">
                {related.map((p) => (
                  <div key={p.id} data-product-card style={{ opacity: 0 }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Categories */}
          <div ref={otherSectionsRef}>
            {otherCategories.map((cat) => {
              const catProducts = products.filter((p) => p.category === cat).slice(0, 4);
              if (!catProducts.length) return null;
              return (
                <div key={cat} data-category-section className="mt-20 sm:mt-24">
                  <div className="flex items-baseline justify-between mb-10">
                    <h2 className="font-[family-name:var(--font-playfair)] text-[26px] sm:text-[32px] text-black"
                      style={{ opacity: 0 }}>
                      {categoryLabel[cat]}
                    </h2>
                    <Link href={`/?category=${cat}`} scroll={false}
                      onClick={() => sessionStorage.setItem("scrollToShop", "1")}
                      data-view-all
                      className="text-[11px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors font-[family-name:var(--font-inter)]"
                      style={{ opacity: 0 }}>
                      View All →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-6">
                    {catProducts.map((p) => (
                      <div key={p.id} data-product-card style={{ opacity: 0 }}>
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </Container>
      </section>
    </>
  );
}