 "use client";

import Image from "next/image";
import Container from "@/Container";
import { useState, useContext } from "react";
import { useHeader } from "./HeaderAnimation";
import { WishlistContext, type WishlistItem } from "@/sections/cart.tsx/cart";

// ─── Wishlist Sidebar ─────────────────────────────────────────────────────────

function WishlistSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ctx = useContext(WishlistContext);
  const items: WishlistItem[] = ctx?.items ?? [];
  const remove = ctx?.remove ?? (() => {});

  return (
    <div className={`
      fixed top-0 right-0 h-full z-50
      w-[24vw] min-w-[280px] max-w-[340px]
      bg-white/65 backdrop-blur-md shadow-xl
      flex flex-col
      transform transition-transform duration-300
      ${open ? "translate-x-0" : "translate-x-full"}
    `}>
      {/* Header */}
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

      {/* Items */}
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
          <button className="w-full bg-black text-white font-[family-name:var(--font-inter)] text-[11px] tracking-[0.15em] uppercase py-4 hover:bg-black/80 transition-colors cursor-pointer">
            Move to Bag
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Header Heart — ثابت دايمًا، مش بيتغير لون ────────────────────────────────

function HeaderHeart({
  iconRef,
  textColor,
  onClick,
}: {
  iconRef: React.RefObject<HTMLButtonElement | null>;
  textColor: string;
  onClick: () => void;
}) {
  return (
    <button
      ref={iconRef}
      aria-label="Wishlist"
      onClick={onClick}
      className={`relative cursor-pointer transition-colors duration-300 ${textColor}`}
      style={{ willChange: "clip-path" }}
    >
      {/* القلب ثابت دايمًا — مش بيتحول أحمر ومش بيعد */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

// ─── Cart Icon — نفس الأيقونة الأصلية بس بـ filter يتحكم في اللون ─────────────

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen]         = useState(false);

  const { headerRef, brandRef, icon1Ref, icon2Ref, headerClass, textColor } = useHeader();
  // scrolled = الهيدر على خلفية بيضا → الأيقونات تبقى سودا
  const scrolled = textColor === "text-black";

  return (
    <>
      <header className={headerClass} ref={headerRef}>
        <Container className="flex items-center justify-between py-4 sm:py-5 lg:py-6">

          {/* Left */}
          <div className="flex-1" />

          {/* Center — AURA */}
          <div className="flex-1 flex justify-center">
            <span
              ref={brandRef}
              className={`font-[family-name:var(--font-playfair)] text-headline-md sm:text-headline-lg tracking-[0.3em] uppercase font-semibold transition-colors duration-300 ${textColor}`}
              style={{ willChange: "clip-path" }}
            >
              AURA
            </span>
          </div>

          {/* Right — Icons */}
          <div className="flex-1 flex justify-end items-center gap-4 sm:gap-6">

            {/* ❤ Wishlist — ثابت */}
            <HeaderHeart
              iconRef={icon1Ref}
              textColor={textColor}
              onClick={() => { setWishlistOpen(true); setCartOpen(false); }}
            />

            {/* 🛍 Cart — نفس الأيقونة الأصلية، filter يتغير مع الهيدر */}
            <button
              ref={icon2Ref}
              aria-label="Shopping Bag"
              onClick={() => { setCartOpen(true); setWishlistOpen(false); }}
              className="cursor-pointer"
              style={{ willChange: "clip-path" }}
            >
              <Image
                src="/icon/shoping.svg"
                alt="Shopping Bag"
                width={22}
                height={22}
                className="sm:w-6 sm:h-6 transition-all duration-300"
                style={{
                  filter: scrolled
                    ? "brightness(0) invert(0)"   // أسود لما الهيدر يبيض
                    : "brightness(0) invert(1)",   // أبيض لما الهيدر شفاف
                }}
              />
            </button>
          </div>

        </Container>
      </header>

      {/* Overlay */}
      {(wishlistOpen || cartOpen) && (
        <div
          className="fixed inset-0 bg-black/30 z-40 cursor-pointer"
          onClick={() => { setWishlistOpen(false); setCartOpen(false); }}
        />
      )}

      {/* Wishlist Sidebar */}
      <WishlistSidebar open={wishlistOpen} onClose={() => setWishlistOpen(false)} />

      {/* Cart Bar */}
      <div className={`fixed top-0 right-0 h-full w-[24vw] min-w-[280px] max-w-[340px] bg-white/65 backdrop-blur-md z-50 shadow-xl transform transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b">
          <span className="text-headline-md tracking-widest uppercase">Cart</span>
          <button onClick={() => setCartOpen(false)} className="text-xl cursor-pointer">✕</button>
        </div>
        <div className="p-6 text-body-md text-gray-400">
          No items yet.
        </div>
      </div>
    </>
  );
}