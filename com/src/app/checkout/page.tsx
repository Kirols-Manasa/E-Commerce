 "use client";

import {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/Container";
import { CartContext, type CartItem } from "@/sections/cart.tsx/cart";

// ─── Utility: staggered entrance ─────────────────────────────────────────────
function useReveal(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = Array.from(el.querySelectorAll("[data-reveal]")) as HTMLElement[];
    children.forEach((c, i) => {
      c.style.opacity = "0";
      c.style.transform = "translateY(28px)";
      c.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s`;
    });
    const id = requestAnimationFrame(() => {
      children.forEach((c) => {
        c.style.opacity = "1";
        c.style.transform = "translateY(0)";
      });
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

// ─── Payment method icons (SVG inline) ───────────────────────────────────────
const PaymentIcons = () => (
  <div className="flex items-center gap-2.5">
    {/* Visa */}
    <div className="h-7 w-11 rounded border border-black/8 bg-white flex items-center justify-center">
      <svg viewBox="0 0 38 24" width="30" height="19">
        <rect width="38" height="24" rx="3" fill="#fff"/>
        <path d="M14.2 16.8l1.5-9.1h2.4l-1.5 9.1h-2.4zm9.7-8.9c-.5-.2-1.3-.4-2.2-.4-2.4 0-4.1 1.3-4.1 3.1 0 1.4 1.2 2.1 2.2 2.6 1 .5 1.3.8 1.3 1.2 0 .6-.8.9-1.5.9-.9 0-1.5-.1-2.3-.5l-.3-.2-.3 2.1c.6.3 1.7.5 2.9.5 2.6 0 4.2-1.3 4.2-3.2 0-1.1-.6-1.9-2-2.5-.8-.4-1.3-.7-1.3-1.1 0-.4.4-.8 1.4-.8.8 0 1.4.2 1.8.4l.2.1.3-2.2zm5.6-.2h-1.9c-.6 0-1 .2-1.3.7l-3.6 8.4h2.6l.5-1.5h3.1l.3 1.5h2.3l-2-9.1zm-3 5.7l1-2.7.6 2.7h-1.6zm-18.6-5.7l-2.4 6.2-.3-1.3c-.5-1.6-2-3.4-3.7-4.3l2.2 8.4h2.6l3.9-9.1h-2.3z" fill="#1434CB"/>
        <path d="M5.2 7.9H1.1l-.1.3c3.2.8 5.3 2.8 6.2 5.1l-.9-4.6c-.2-.5-.6-.8-1.1-.8z" fill="#F9A51A"/>
      </svg>
    </div>
    {/* Mastercard */}
    <div className="h-7 w-11 rounded border border-black/8 bg-white flex items-center justify-center">
      <svg viewBox="0 0 38 24" width="30" height="19">
        <rect width="38" height="24" rx="3" fill="#fff"/>
        <circle cx="15" cy="12" r="6" fill="#EB001B"/>
        <circle cx="23" cy="12" r="6" fill="#F79E1B"/>
        <path d="M19 7.8a6 6 0 0 1 0 8.4A6 6 0 0 1 19 7.8z" fill="#FF5F00"/>
      </svg>
    </div>
    {/* Apple Pay */}
    <div className="h-7 w-11 rounded border border-black/8 bg-black flex items-center justify-center">
      <svg viewBox="0 0 38 24" width="30" height="19">
        <rect width="38" height="24" rx="3" fill="#000"/>
        <text x="19" y="16" textAnchor="middle" fill="white" fontSize="8" fontFamily="-apple-system,sans-serif" fontWeight="500">Pay</text>
      </svg>
    </div>
    {/* PayPal */}
    <div className="h-7 w-11 rounded border border-black/8 bg-white flex items-center justify-center">
      <svg viewBox="0 0 38 24" width="30" height="19">
        <rect width="38" height="24" rx="3" fill="#fff"/>
        <text x="19" y="16" textAnchor="middle" fill="#003087" fontSize="7" fontFamily="Arial" fontWeight="700">PayPal</text>
      </svg>
    </div>
  </div>
);

// ─── Order Item Row ───────────────────────────────────────────────────────────
function OrderItem({
  item,
  onRemove,
  onQty,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onQty: (id: string, qty: number) => void;
}) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.id), 350);
  };

  return (
    <div
      className="group flex gap-4 py-5 border-b border-black/6 last:border-0"
      style={{
        opacity: removing ? 0 : 1,
        transform: removing ? "translateX(12px)" : "translateX(0)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
    >
      {/* Image — full bleed in small square */}
      <div className="relative w-[72px] h-[90px] shrink-0 overflow-hidden bg-[#F5F4F2]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="72px"
        />
        {/* qty badge */}
        <div className="absolute top-1 left-1 w-5 h-5 bg-black text-white text-[9px] font-semibold font-[family-name:var(--font-inter)] flex items-center justify-center">
          {item.qty}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="font-[family-name:var(--font-inter)] text-[13px] font-medium text-black leading-snug truncate pr-2">
            {item.name}
          </p>
          <p className="font-[family-name:var(--font-inter)] text-[11px] text-black/35 mt-0.5 uppercase tracking-wide">
            {item.originalPrice ? "SALE" : "Full Price"}
          </p>
        </div>

        {/* Qty controls */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => item.qty > 1 && onQty(item.id, item.qty - 1)}
            className="w-6 h-6 border border-black/15 flex items-center justify-center text-black/40 hover:border-black hover:text-black transition-all duration-150 cursor-pointer text-sm leading-none"
          >
            −
          </button>
          <span className="font-[family-name:var(--font-inter)] text-[12px] text-black w-4 text-center">
            {item.qty}
          </span>
          <button
            onClick={() => onQty(item.id, item.qty + 1)}
            className="w-6 h-6 border border-black/15 flex items-center justify-center text-black/40 hover:border-black hover:text-black transition-all duration-150 cursor-pointer text-sm leading-none"
          >
            +
          </button>
          <button
            onClick={handleRemove}
            className="ml-1 font-[family-name:var(--font-inter)] text-[10px] text-black/25 hover:text-[#E8192C] transition-colors duration-150 cursor-pointer uppercase tracking-wide"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right flex flex-col justify-between">
        <span className="font-[family-name:var(--font-inter)] text-[14px] font-semibold text-black">
          ${(item.price * item.qty).toLocaleString()}
        </span>
        {item.originalPrice && (
          <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/30 line-through">
            ${(item.originalPrice * item.qty).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Promo Code ───────────────────────────────────────────────────────────────
function PromoCode() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const apply = () => {
    if (!code.trim()) return;
    setState("loading");
    setTimeout(() => {
      setState(code.toUpperCase() === "AURA20" ? "success" : "error");
    }, 1000);
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="font-[family-name:var(--font-inter)] text-[11px] text-black/40 hover:text-black uppercase tracking-[0.12em] transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
      >
        <span
          style={{
            display: "inline-block",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        >
          ›
        </span>
        Promo Code
      </button>

      <div
        style={{
          maxHeight: open ? "80px" : "0",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease",
        }}
      >
        <div className="flex gap-2 mt-3">
          <input
            placeholder="Enter code"
            value={code}
            onChange={(e) => { setCode(e.target.value); setState("idle"); }}
            className="flex-1 border border-black/15 bg-white px-3 py-2 font-[family-name:var(--font-inter)] text-[12px] text-black placeholder:text-black/25 focus:outline-none focus:border-black transition-colors uppercase tracking-widest"
          />
          <button
            onClick={apply}
            className="px-4 py-2 bg-black text-white font-[family-name:var(--font-inter)] text-[10px] tracking-[0.15em] uppercase hover:bg-black/75 transition-colors cursor-pointer"
          >
            {state === "loading" ? (
              <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin inline-block" />
            ) : "Apply"}
          </button>
        </div>
        {state === "success" && (
          <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#2a7a2a] mt-1.5 tracking-wide">
            ✓ 20% discount applied
          </p>
        )}
        {state === "error" && (
          <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#E8192C] mt-1.5 tracking-wide">
            Invalid code. Try AURA20
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Order Panel (right) ──────────────────────────────────────────────────────
function OrderPanel({
  items,
  onRemove,
  onQty,
}: {
  items: CartItem[];
  onRemove: (id: string) => void;
  onQty: (id: string, qty: number) => void;
}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 200 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="bg-[#F7F6F4] px-6 py-8">
      <h2
        data-reveal
        className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-black mb-6 leading-tight"
      >
        Your Order
      </h2>

      {/* Items list */}
      <div data-reveal>
        {items.map((item) => (
          <OrderItem key={item.id} item={item} onRemove={onRemove} onQty={onQty} />
        ))}
      </div>

      {/* Promo */}
      <div data-reveal>
        <PromoCode />
      </div>

      {/* Totals */}
      <div data-reveal className="mt-6 pt-5 border-t border-black/10 space-y-2.5">
        <div className="flex justify-between">
          <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/40 uppercase tracking-[0.12em]">
            Subtotal
          </span>
          <span className="font-[family-name:var(--font-inter)] text-[13px] text-black">
            ${subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-[family-name:var(--font-inter)] text-[11px] text-black/40 uppercase tracking-[0.12em]">
            Shipping
          </span>
          {shipping === 0 ? (
            <span className="font-[family-name:var(--font-inter)] text-[12px] text-[#2a7a2a] font-medium">
              Free
            </span>
          ) : (
            <span className="font-[family-name:var(--font-inter)] text-[13px] text-black">
              ${shipping}
            </span>
          )}
        </div>
      </div>

      <div data-reveal className="mt-4 pt-4 border-t border-black/10 flex justify-between items-baseline">
        <span className="font-[family-name:var(--font-inter)] text-[11px] text-black uppercase tracking-[0.15em] font-semibold">
          Total
        </span>
        <div className="text-right">
          <span className="font-[family-name:var(--font-playfair)] text-[28px] font-semibold text-black">
            ${total.toLocaleString()}
          </span>
          <p className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 mt-0.5">
            USD · incl. taxes
          </p>
        </div>
      </div>

      {/* Trust line */}
      <div data-reveal className="mt-6 flex items-center gap-2 text-black/30">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.12em]">
          Secured · 256-bit SSL
        </span>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasVal = value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor={id}
        className="block font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.15em] mb-2 transition-colors duration-200"
        style={{ color: focused ? "#111" : "rgba(0,0,0,0.4)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={focused ? placeholder : ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-white px-4 py-3.5 font-[family-name:var(--font-inter)] text-[14px] text-black placeholder:text-black/20 focus:outline-none transition-all duration-200"
          style={{
            border: `1px solid ${focused ? "#111" : "rgba(0,0,0,0.12)"}`,
          }}
        />
        {/* valid check */}
        {hasVal && !focused && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ opacity: 1, transition: "opacity 0.2s" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a7a2a" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Card number formatter ────────────────────────────────────────────────────
function fmtCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function fmtExp(v: string) {
  return v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1 / $2");
}

// ─── Payment Form (main left panel) ──────────────────────────────────────────
function PaymentForm({ onPlace, placing }: { onPlace: () => void; placing: boolean }) {
  const [tab, setTab] = useState<"card" | "apple" | "paypal">("card");
  const [ship, setShip] = useState({
    email: "", name: "", address: "", city: "", zip: "", country: "United States",
  });
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });

  const updateShip = (k: keyof typeof ship, v: string) =>
    setShip((p) => ({ ...p, [k]: v }));
  const updateCard = (k: keyof typeof card, v: string) =>
    setCard((p) => ({ ...p, [k]: v }));

  const cardDigits = card.number.replace(/\s/g, "");
  const cardBrand =
    cardDigits[0] === "4" ? "Visa" :
    cardDigits[0] === "5" ? "Mastercard" :
    cardDigits[0] === "3" ? "Amex" : null;

  const formValid =
    ship.email && ship.name && ship.address && ship.city && ship.zip &&
    (tab !== "card" || (cardDigits.length === 16 && card.name && card.exp.length >= 7 && card.cvv.length >= 3));

  const revealRef = useReveal([tab]);

  return (
    <div ref={revealRef} className="space-y-10">

      {/* Contact */}
      <div>
        <p data-reveal className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 uppercase tracking-[0.2em] mb-5">
          01 — Contact
        </p>
        <div data-reveal>
          <Field label="Email" id="email" type="email" placeholder="you@example.com" value={ship.email} onChange={(v) => updateShip("email", v)} />
        </div>
      </div>

      {/* Shipping */}
      <div>
        <p data-reveal className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 uppercase tracking-[0.2em] mb-5">
          02 — Delivery
        </p>
        <div data-reveal className="space-y-3">
          <Field label="Full Name" id="name" placeholder="As on ID" value={ship.name} onChange={(v) => updateShip("name", v)} />
          <Field label="Address" id="address" placeholder="Street, apartment" value={ship.address} onChange={(v) => updateShip("address", v)} />
          <div className="flex gap-3">
            <Field label="City" id="city" value={ship.city} onChange={(v) => updateShip("city", v)} className="flex-1" />
            <Field label="ZIP" id="zip" value={ship.zip} onChange={(v) => updateShip("zip", v)} className="w-32" />
          </div>
          <div>
            <label className="block font-[family-name:var(--font-inter)] text-[10px] text-black/40 uppercase tracking-[0.15em] mb-2">
              Country
            </label>
            <select
              value={ship.country}
              onChange={(e) => updateShip("country", e.target.value)}
              className="w-full bg-white border border-black/12 px-4 py-3.5 font-[family-name:var(--font-inter)] text-[14px] text-black focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
            >
              {["United States","United Kingdom","Canada","UAE","Saudi Arabia","Egypt","Germany","France","Australia"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div>
        <p data-reveal className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 uppercase tracking-[0.2em] mb-5">
          03 — Payment
        </p>

        {/* Method tabs */}
        <div data-reveal className="flex gap-2 mb-5">
          {(["card", "apple", "paypal"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setTab(m)}
              className="flex-1 py-2.5 border font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer"
              style={{
                border: tab === m ? "1px solid #111" : "1px solid rgba(0,0,0,0.12)",
                background: tab === m ? "#111" : "#fff",
                color: tab === m ? "#fff" : "rgba(0,0,0,0.4)",
              }}
            >
              {m === "card" ? "Card" : m === "apple" ? "Apple Pay" : "PayPal"}
            </button>
          ))}
        </div>

        {/* Payment icons row */}
        <div data-reveal className="mb-5">
          <PaymentIcons />
        </div>

        {/* Card fields */}
        {tab === "card" && (
          <div data-reveal className="space-y-3">
            {/* Card number with brand */}
            <div className="relative">
              <label className="block font-[family-name:var(--font-inter)] text-[10px] text-black/40 uppercase tracking-[0.15em] mb-2">
                Card Number
                {cardBrand && (
                  <span className="ml-2 text-black/30 normal-case tracking-normal">· {cardBrand}</span>
                )}
              </label>
              <input
                type="text"
                placeholder="1234  5678  9012  3456"
                value={card.number}
                onChange={(e) => updateCard("number", fmtCard(e.target.value))}
                className="w-full bg-white border border-black/12 px-4 py-3.5 font-[family-name:var(--font-inter)] text-[14px] text-black placeholder:text-black/20 focus:outline-none focus:border-black transition-colors tracking-[0.2em]"
              />
            </div>
            <Field
              label="Cardholder Name"
              id="cardName"
              placeholder="Exactly as on card"
              value={card.name}
              onChange={(v) => updateCard("name", v)}
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-[family-name:var(--font-inter)] text-[10px] text-black/40 uppercase tracking-[0.15em] mb-2">
                  Expiry
                </label>
                <input
                  placeholder="MM / YY"
                  value={card.exp}
                  onChange={(e) => updateCard("exp", fmtExp(e.target.value))}
                  className="w-full bg-white border border-black/12 px-4 py-3.5 font-[family-name:var(--font-inter)] text-[14px] text-black placeholder:text-black/20 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="w-28">
                <label className="block font-[family-name:var(--font-inter)] text-[10px] text-black/40 uppercase tracking-[0.15em] mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={card.cvv}
                  onChange={(e) => updateCard("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full bg-white border border-black/12 px-4 py-3.5 font-[family-name:var(--font-inter)] text-[14px] text-black placeholder:text-black/20 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Apple Pay mock */}
        {tab === "apple" && (
          <div data-reveal className="border border-black/10 p-6 text-center bg-[#F7F6F4]">
            <p className="font-[family-name:var(--font-inter)] text-[12px] text-black/40 mb-3">
              You'll confirm payment with Touch ID or Face ID
            </p>
            <div className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 text-[13px] font-medium font-[family-name:var(--font-inter)]">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Pay
            </div>
          </div>
        )}

        {/* PayPal mock */}
        {tab === "paypal" && (
          <div data-reveal className="border border-black/10 p-6 text-center bg-[#F7F6F4]">
            <p className="font-[family-name:var(--font-inter)] text-[12px] text-black/40 mb-3">
              You'll be redirected to PayPal to complete your purchase
            </p>
            <div className="inline-flex items-center gap-2 bg-[#003087] text-white px-8 py-3 font-bold text-[13px]">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
                <path d="M7.02 21.997h-4.9c-.39 0-.67-.37-.58-.76l3.87-24.49c.07-.43.44-.75.87-.75h8.46c2.73 0 4.81.64 6.08 1.9 1.2 1.2 1.76 2.94 1.64 5.18-.03.48-.09.94-.18 1.38H7.02v17.54z"/>
              </svg>
              PayPal
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div data-reveal>
        <button
          onClick={onPlace}
          disabled={!formValid || placing}
          className={`w-full py-5 font-[family-name:var(--font-inter)] text-[11px] tracking-[0.25em] uppercase transition-all duration-300 relative overflow-hidden cursor-pointer
            ${formValid && !placing
              ? "bg-black text-white hover:bg-black/85"
              : "bg-black/10 text-black/25 cursor-not-allowed"
            }`}
          style={{ letterSpacing: "0.25em" }}
        >
          {placing ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-3.5 h-3.5 border-[1.5px] border-white/30 border-t-white rounded-full animate-spin" />
              Processing
            </span>
          ) : (
            `Place Order · $${
              tab === "card" ? "" : ""
            }`
          )}
          {!placing && "Place Order"}
        </button>

        <p className="font-[family-name:var(--font-inter)] text-[10px] text-black/25 text-center mt-3 leading-relaxed">
          By placing your order you agree to AURA's terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ orderNum }: { orderNum: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Ring + check animation */}
      <div className="relative w-24 h-24 mb-10">
        <svg className="absolute inset-0" width="96" height="96" viewBox="0 0 96 96">
          <style>{`
            @keyframes ring { to { stroke-dashoffset: 0 } }
            @keyframes check { to { stroke-dashoffset: 0 } }
            .ring-anim { animation: ring 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards }
            .check-anim { animation: check 0.45s cubic-bezier(0.16,1,0.3,1) 0.7s forwards }
          `}</style>
          <circle cx="48" cy="48" r="44" fill="none" stroke="#111" strokeWidth="1.5"
            className="ring-anim"
            style={{ strokeDasharray: 276, strokeDashoffset: 276, transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
          <polyline points="30,48 43,61 66,36" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className="check-anim"
            style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
          />
        </svg>
      </div>

      <span
        className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 uppercase tracking-[0.3em] mb-4"
        style={{ transitionDelay: "0.3s" }}
      >
        Order Confirmed
      </span>

      <h1
        className="font-[family-name:var(--font-playfair)] text-[52px] sm:text-[64px] font-semibold text-black leading-none mb-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
        }}
      >
        Thank you.
      </h1>

      <p
        className="font-[family-name:var(--font-inter)] text-[14px] text-black/40 max-w-xs leading-relaxed mb-2"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.4s",
        }}
      >
        Your order has been received and is being prepared.
      </p>

      <p
        className="font-[family-name:var(--font-inter)] text-[11px] text-black/20 uppercase tracking-[0.2em] mb-12"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.5s",
        }}
      >
        #{orderNum}
      </p>

      <div
        className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.7s ease 0.6s, transform 0.7s ease 0.6s",
        }}
      >
        <Link
          href="/"
          className="flex-1 bg-black text-white font-[family-name:var(--font-inter)] text-[10px] tracking-[0.2em] uppercase py-4 text-center hover:bg-black/80 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

// ─── Empty Cart ───────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1" opacity="0.15" className="mb-8">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <h2 className="font-[family-name:var(--font-playfair)] text-[32px] font-semibold text-black mb-3">
        Your bag is empty
      </h2>
      <p className="font-[family-name:var(--font-inter)] text-[14px] text-black/35 mb-10">
        Add items to continue.
      </p>
      <Link
        href="/"
        className="bg-black text-white font-[family-name:var(--font-inter)] text-[10px] tracking-[0.2em] uppercase px-12 py-4 hover:bg-black/80 transition-colors"
      >
        Shop Now
      </Link>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const cartCtx = useContext(CartContext);
  const [localItems, setLocalItems] = useState<CartItem[]>([]);
  const [synced, setSynced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNum] = useState(() =>
    "AUR-" + Math.floor(Math.random() * 900000 + 100000)
  );

  // Sync once from cart context
  useEffect(() => {
    if (cartCtx?.items && !synced) {
      setLocalItems([...cartCtx.items]);
      setSynced(true);
    }
  }, [cartCtx?.items, synced]);

  const handleRemove = useCallback((id: string) => {
    setTimeout(() => setLocalItems((p) => p.filter((i) => i.id !== id)), 360);
  }, []);

  const handleQty = useCallback((id: string, qty: number) => {
    setLocalItems((p) => p.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, []);

  const handlePlace = () => {
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setSuccess(true);
    }, 2200);
  };

  // Entrance animation for header section
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 30);
    return () => clearTimeout(t);
  }, []);

  if (success) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <Container>
          <SuccessScreen orderNum={orderNum} />
        </Container>
      </main>
    );
  }

  if (synced && localItems.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <Container>
          <EmptyCart />
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-16 sm:pt-20 pb-24">
      <Container>

        {/* Page header */}
        <div
          className="pt-8 pb-10 border-b border-black/8 mb-12"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(-16px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 uppercase tracking-[0.25em]">
                AURA
              </span>
              <h1 className="font-[family-name:var(--font-playfair)] text-[36px] sm:text-[48px] font-semibold text-black leading-tight mt-1">
                Checkout
              </h1>
            </div>
            <Link
              href="/"
              className="font-[family-name:var(--font-inter)] text-[11px] text-black/30 uppercase tracking-[0.15em] hover:text-black transition-colors hidden sm:block"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-start">

          {/* Left — payment form */}
          <div
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
            }}
          >
            <PaymentForm onPlace={handlePlace} placing={placing} />
          </div>

          {/* Right — order summary */}
          <div
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.18s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.18s",
            }}
          >
            <OrderPanel items={localItems} onRemove={handleRemove} onQty={handleQty} />
          </div>
        </div>

      </Container>
    </main>
  );
}