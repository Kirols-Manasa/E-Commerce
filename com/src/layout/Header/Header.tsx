 "use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/Container";
import { useState, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useHeader } from "./HeaderAnimation";
import { WishlistContext, CartContext, type WishlistItem, type CartItem } from "@/sections/cart.tsx/cart";

// ─── Wishlist Sidebar ─────────────────────────────────────────────────────────

function WishlistSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ctx = useContext(WishlistContext);
  const cartCtx = useContext(CartContext);
  const router = useRouter();
  const items: WishlistItem[] = ctx?.items ?? [];
  const remove = ctx?.remove ?? (() => {});

  const moveToBag = () => {
    if (!cartCtx || !ctx) return;
    items.forEach((item) => {
      cartCtx.add({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
      });
      ctx.remove(item.id);
    });
    onClose();
    router.push("/checkout");
  };

  return (
    <div className={`
      fixed top-0 right-0 h-full z-50
      w-full sm:w-[24vw] sm:min-w-[280px] sm:max-w-[340px]
      bg-white/65 backdrop-blur-md shadow-xl
      flex flex-col
      transform transition-transform duration-300
      ${open ? "translate-x-0" : "translate-x-full"}
    `}>
      <div className="flex items-center justify-between p-6 border-b border-black/8">
        <div className="flex items-center gap-2">
          <span className="text-headline-md tracking-widest uppercase">Wishlist</span>
          {items.length > 0 && (
            <span className="text-[11px] text-white bg-black rounded-full w-5 h-5 flex items-center justify-center font-[family-name:var(--font-inter)]">
              {items.length}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-xl cursor-pointer hover:opacity-60 transition-opacity">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.2" opacity="0.2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className="font-[family-name:var(--font-inter)] text-[13px] text-black/35 leading-relaxed">
              No saved items yet.<br />Tap ♡ on any product.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-black/6">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 px-5 py-4">
                <div className="relative w-14 h-18 shrink-0 bg-[#F5F4F2] overflow-hidden rounded-sm" style={{ height: "72px" }}>
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                  <p className="font-[family-name:var(--font-inter)] text-[13px] font-medium text-black leading-snug truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-[family-name:var(--font-inter)] text-[13px] font-semibold text-black">
                      ${item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/35 line-through">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="self-start font-[family-name:var(--font-inter)] text-[11px] text-black/30 hover:text-[#E8192C] transition-colors cursor-pointer mt-1"
                  >
                    Remove
                  </button>
                </div>
                <div className="shrink-0 pt-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#E8192C" stroke="#E8192C" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="px-6 py-5 border-t border-black/8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/40 uppercase tracking-widest">Total</span>
            <span className="font-[family-name:var(--font-inter)] text-[15px] font-semibold text-black">
              ${items.reduce((s, i) => s + i.price, 0).toLocaleString()}
            </span>
          </div>
          <button
            onClick={moveToBag}
            className="w-full bg-black text-white font-[family-name:var(--font-inter)] text-[11px] tracking-[0.15em] uppercase py-4 hover:bg-black/80 transition-colors cursor-pointer"
          >
            Move to Bag
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Cart Sidebar ─────────────────────────────────────────────────────────────

function CartSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ctx = useContext(CartContext);
    const router = useRouter(); // ← أضف
  const items: CartItem[] = ctx?.items ?? [];
  const remove = ctx?.remove ?? (() => {});

  return (
    <div className={`
      fixed top-0 right-0 h-full z-50
      w-full sm:w-[24vw] sm:min-w-[280px] sm:max-w-[340px]
      bg-white/65 backdrop-blur-md shadow-xl
      flex flex-col
      transform transition-transform duration-300
      ${open ? "translate-x-0" : "translate-x-full"}
    `}>
      <div className="flex items-center justify-between p-6 border-b border-black/8">
        <div className="flex items-center gap-2">
          <span className="text-headline-md tracking-widest uppercase">Cart</span>
          {items.length > 0 && (
            <span className="text-[11px] text-white bg-black rounded-full w-5 h-5 flex items-center justify-center font-[family-name:var(--font-inter)]">
              {ctx?.count}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-xl cursor-pointer hover:opacity-60 transition-opacity">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <p className="font-[family-name:var(--font-inter)] text-[13px] text-black/35 leading-relaxed">
              No items yet.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-black/6">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 px-5 py-4">
                <div className="relative w-14 shrink-0 bg-[#F5F4F2] overflow-hidden rounded-sm" style={{ height: "72px" }}>
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                  <p className="font-[family-name:var(--font-inter)] text-[13px] font-medium text-black leading-snug truncate">
                    {item.name} {item.qty > 1 && <span className="text-black/40">× {item.qty}</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-[family-name:var(--font-inter)] text-[13px] font-semibold text-black">
                      ${item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/35 line-through">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="self-start font-[family-name:var(--font-inter)] text-[11px] text-black/30 hover:text-[#E8192C] transition-colors cursor-pointer mt-1"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="px-6 py-5 border-t border-black/8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/40 uppercase tracking-widest">Total</span>
            <span className="font-[family-name:var(--font-inter)] text-[15px] font-semibold text-black">
              ${items.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString()}
            </span>
          </div>
           <button
  onClick={() => { onClose(); router.push("/checkout"); }}
  className="block w-full bg-black text-white font-[family-name:var(--font-inter)] text-[11px] tracking-[0.15em] uppercase py-4 hover:bg-black/80 transition-colors cursor-pointer text-center"
>
  Checkout
</button>
        </div>
      )}
    </div>
  );
}

// ─── Header Heart ─────────────────────────────────────────────────────────────

function HeaderHeart({
  iconRef,
  textColor,
  count,
  onClick,
}: {
  iconRef: React.RefObject<HTMLButtonElement | null>;
  textColor: string;
  count: number;
  onClick: () => void;
}) {
  const [show, setShow] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 1200);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <button
      ref={iconRef}
      aria-label="Wishlist"
      onClick={onClick}
      className={`relative cursor-pointer transition-colors duration-300 ${textColor}`}
      style={{ willChange: "clip-path" }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {show && (
        <span className="absolute -top-3 -right-2.5 text-[11px] font-bold text-[#E8192C] leading-none animate-zoom-in-fade">
          +{count}
        </span>
      )}
    </button>
  );
}

// ─── Header Bag ───────────────────────────────────────────────────────────────

function HeaderBag({
  iconRef,
  textColor,
  count,
  onClick,
}: {
  iconRef: React.RefObject<HTMLButtonElement | null>;
  textColor: string;
  count: number;
  onClick: () => void;
}) {
  const [show, setShow] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 1200);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <button
      ref={iconRef}
      aria-label="Shopping Bag"
      onClick={onClick}
      className={`relative cursor-pointer transition-colors duration-300 ${textColor}`}
      style={{ willChange: "clip-path" }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {show && (
        <span className="absolute -top-3 -right-2.5 text-[11px] font-bold text-[#E8192C] leading-none animate-zoom-in-fade">
          +{count}
        </span>
      )}
    </button>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen]         = useState(false);
  const pathname = usePathname();

  const wishlistCtx = useContext(WishlistContext);
  const cartCtx      = useContext(CartContext);

  const forceDark = pathname !== "/";

  const { headerRef, brandRef, icon1Ref, icon2Ref, headerClass, textColor } = useHeader(40, forceDark);

  return (
    <>
      <header className={headerClass} ref={headerRef}>
        <Container className="flex items-center justify-between py-4 sm:py-5 lg:py-6">
          <div className="flex-1" />

          <div className="flex-1 flex justify-center">
            <span
              ref={brandRef}
              className={`font-[family-name:var(--font-playfair)] text-headline-md sm:text-headline-lg tracking-[0.3em] uppercase font-semibold transition-colors duration-300 ${textColor}`}
              style={{ willChange: "clip-path" }}
            >
              AURA
            </span>
          </div>

          <div className="flex-1 flex justify-end items-center gap-4 sm:gap-6">
            <HeaderHeart
              iconRef={icon1Ref}
              textColor={textColor}
              count={wishlistCtx?.count ?? 0}
              onClick={() => { setWishlistOpen(true); setCartOpen(false); }}
            />
            <HeaderBag
              iconRef={icon2Ref}
              textColor={textColor}
              count={cartCtx?.count ?? 0}
              onClick={() => { setCartOpen(true); setWishlistOpen(false); }}
            />
          </div>
        </Container>
      </header>

      {(wishlistOpen || cartOpen) && (
        <div
          className="fixed inset-0 bg-black/30 z-40 cursor-pointer"
          onClick={() => { setWishlistOpen(false); setCartOpen(false); }}
        />
      )}

      <WishlistSidebar open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}