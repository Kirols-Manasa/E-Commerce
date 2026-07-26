 "use client";

import Image from "next/image";
import Container from "@/Container";
import { useState } from "react";
import { useHeader } from "./HeaderAnimation";

export default function Header() {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen]         = useState(false);

  const { headerRef, brandRef, icon1Ref, icon2Ref, headerClass, textColor } = useHeader();

  return (
    <>
      <header className={headerClass} ref={headerRef}>
        <Container className="flex items-center justify-between py-4 sm:py-5 lg:py-6">

          {/* Left - Empty for balance */}
          <div className="flex-1" />

          {/* Center - AURA */}
          <div className="flex-1 flex justify-center">
            <span
              ref={brandRef}
              className={`font-[family-name:var(--font-playfair)] text-headline-md sm:text-headline-lg tracking-[0.3em] uppercase font-semibold transition-colors duration-300 ${textColor}`}
              style={{ willChange: "clip-path" }}
            >
              AURA
            </span>
          </div>

          {/* Right - Icons */}
          <div className="flex-1 flex justify-end items-center gap-4 sm:gap-6">
            <button
              ref={icon1Ref}
              aria-label="Wishlist"
              onClick={() => setWishlistOpen(true)}
              className={`cursor-pointer transition-colors duration-300 ${textColor}`}
              style={{ willChange: "clip-path" }}
            >
              <Image src="/icon/favorit.svg" alt="Wishlist" width={22} height={22} className="sm:w-6 sm:h-6" />
            </button>
            <button
              ref={icon2Ref}
              aria-label="Shopping Bag"
              onClick={() => setCartOpen(true)}
              className={`cursor-pointer transition-colors duration-300 ${textColor}`}
              style={{ willChange: "clip-path" }}
            >
              <Image src="/icon/shoping.svg" alt="Shopping Bag" width={22} height={22} className="sm:w-6 sm:h-6" />
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

      {/* Wishlist Bar */}
       <div className={`fixed top-0 right-0 h-full w-[24vw] min-w-[280px] max-w-[340px] bg-white/65 backdrop-blur-md z-50 shadow-xl transform transition-transform duration-300 ${wishlistOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b">
          <span className="text-headline-md tracking-widest uppercase">Wishlist</span>
          <button onClick={() => setWishlistOpen(false)} className="text-xl cursor-pointer">✕</button>
        </div>
        <div className="p-6 text-body-md text-gray-400">
          No items yet.
        </div>
      </div>

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