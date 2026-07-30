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
import { gsap } from "gsap";
import Container from "@/Container";
import { CartContext, type CartItem } from "@/sections/cart.tsx/cart";

// ─── Payment method icons ─────────────────────────────────────────────────────
const PaymentIcons = () => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-7 w-11 rounded-md border border-black/8 bg-white flex items-center justify-center">
      <svg viewBox="0 0 48 30" width="34" height="21">
        <path d="M17 20l2-10h3l-2 10h-3zm12-9.8c-.6-.2-1.6-.5-2.8-.5-3 0-5.1 1.6-5.1 3.8 0 1.7 1.5 2.6 2.7 3.2 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.1-1.9 1.1-1.1 0-1.8-.2-2.8-.6l-.4-.2-.4 2.6c.7.3 2.1.6 3.6.6 3.2 0 5.3-1.6 5.3-4 0-1.3-.8-2.3-2.5-3.1-1-.5-1.6-.9-1.6-1.4 0-.5.5-1 1.8-1 1 0 1.8.2 2.3.5l.3.1.4-2.6zm7.2-.2h-2.3c-.7 0-1.3.2-1.6.9L28 20h3.2l.6-1.8h3.9l.4 1.8h2.9L35.2 10zm-3.7 7l1.2-3.4.7 3.4h-1.9zM13.2 10l-3 6.9-.3-1.6C9.3 13.4 7.4 11.1 5.2 10l2.7 10h3.3l4.8-10h-2.8z" fill="#1434CB"/>
        <path d="M7.3 10.5H2.3l-.1.4c4 1 6.6 3.5 7.7 6.4l-1.1-5.8c-.2-.6-.8-1-1.5-1z" fill="#F9A51A"/>
      </svg>
    </div>
    <div className="h-7 w-11 rounded-md border border-black/8 bg-white flex items-center justify-center">
      <svg viewBox="0 0 48 30" width="34" height="21">
        <circle cx="19" cy="15" r="8" fill="#EB001B"/>
        <circle cx="29" cy="15" r="8" fill="#F79E1B"/>
        <path d="M24 8.5a8 8 0 0 1 0 13A8 8 0 0 1 24 8.5z" fill="#FF5F00"/>
      </svg>
    </div>
    <div className="h-7 w-11 rounded-md border border-black/8 bg-black flex items-center justify-center">
      <svg viewBox="0 0 48 30" width="34" height="21">
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontFamily="-apple-system,sans-serif" fontWeight="500"> Pay</text>
      </svg>
    </div>
    <div className="h-7 w-11 rounded-md border border-black/8 bg-white flex items-center justify-center">
      <svg viewBox="0 0 48 30" width="34" height="21">
        <text x="24" y="19" textAnchor="middle" fill="#003087" fontSize="9" fontFamily="Arial" fontWeight="700">PayPal</text>
      </svg>
    </div>
    <div className="h-7 w-11 rounded-md border border-black/8 bg-[#006FCF] flex items-center justify-center">
      <svg viewBox="0 0 48 30" width="34" height="21">
        <text x="24" y="19" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial" fontWeight="700">AMEX</text>
      </svg>
    </div>
  </div>
);

// ─── Order Item Row ───────────────────────────────────────────────────────────
function OrderItem({
  item,
  onRemove,
  onQty,
  index,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onQty: (id: string, qty: number) => void;
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rowRef.current) return;
    gsap.fromTo(
      rowRef.current,
      { opacity: 0, y: 12, filter: "blur(2px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        delay: 0.45 + index * 0.08,
        ease: "power3.out",
      }
    );
  }, [index]);

  const handleRemove = () => {
    if (rowRef.current) {
      gsap.to(rowRef.current, {
        opacity: 0,
        x: 10,
        filter: "blur(3px)",
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => onRemove(item.id),
      });
    } else {
      onRemove(item.id);
    }
  };

  return (
    <div
      ref={rowRef}
      className="flex gap-3 py-4 border-b border-black/6 last:border-0"
      style={{ opacity: 0 }}
    >
      <div className="relative w-[52px] h-[64px] shrink-0 overflow-hidden rounded-md bg-[#F5F4F2]">
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="52px" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-[family-name:var(--font-inter)] text-[13px] font-medium text-black leading-snug truncate">
          {item.name}
        </p>
        {item.originalPrice && (
          <span className="inline-block mt-0.5 text-[10px] text-white bg-black px-1.5 py-0.5 rounded font-[family-name:var(--font-inter)] uppercase tracking-wide">
            Sale
          </span>
        )}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => item.qty > 1 && onQty(item.id, item.qty - 1)}
            className="w-5 h-5 border border-black/15 rounded flex items-center justify-center text-black/40 hover:border-black hover:text-black transition-all text-sm leading-none cursor-pointer"
          >−</button>
          <span className="font-[family-name:var(--font-inter)] text-[12px] text-black w-4 text-center">{item.qty}</span>
          <button
            onClick={() => onQty(item.id, item.qty + 1)}
            className="w-5 h-5 border border-black/15 rounded flex items-center justify-center text-black/40 hover:border-black hover:text-black transition-all text-sm leading-none cursor-pointer"
          >+</button>
          <button
            onClick={handleRemove}
            className="ml-1 font-[family-name:var(--font-inter)] text-[10px] text-black/25 hover:text-[#E8192C] transition-colors cursor-pointer"
          >Remove</button>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <span className="font-[family-name:var(--font-inter)] text-[13px] font-semibold text-black">
          ${(item.price * item.qty).toLocaleString()}
        </span>
        {item.originalPrice && (
          <p className="font-[family-name:var(--font-inter)] text-[11px] text-black/30 line-through mt-0.5">
            ${(item.originalPrice * item.qty).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Order Panel ──────────────────────────────────────────────────────────────
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
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 18, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.85,
        delay: 0.18,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div ref={panelRef} className="bg-[#F7F6F4] rounded-xl px-5 py-6" style={{ opacity: 0 }}>
      <h2 className="font-[family-name:var(--font-playfair)] text-[20px] font-semibold text-black mb-4">
        Your Order
      </h2>
      <div>
        {items.map((item, i) => (
          <OrderItem key={item.id} item={item} onRemove={onRemove} onQty={onQty} index={i} />
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-black/10 space-y-2">
        <div className="flex justify-between">
          <span className="font-[family-name:var(--font-inter)] text-[12px] text-black/40">Subtotal</span>
          <span className="font-[family-name:var(--font-inter)] text-[13px] text-black">${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-[family-name:var(--font-inter)] text-[12px] text-black/40">Shipping</span>
          {shipping === 0 ? (
            <span className="font-[family-name:var(--font-inter)] text-[12px] text-[#2a7a2a] font-medium">Free</span>
          ) : (
            <span className="font-[family-name:var(--font-inter)] text-[13px] text-black">${shipping}</span>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-black/10 flex justify-between items-baseline">
        <span className="font-[family-name:var(--font-inter)] text-[12px] text-black font-semibold uppercase tracking-wide">Total</span>
        <div className="text-right">
          <span className="font-[family-name:var(--font-playfair)] text-[26px] font-semibold text-black">
            ${total.toLocaleString()}
          </span>
          <p className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 mt-0.5">USD · incl. taxes</p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-black/30">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.12em]">
          256-bit SSL · Secure Checkout
        </span>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}: {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasVal = value.length > 0;
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    setFocused(true);
    if (wrapRef.current) {
      gsap.to(wrapRef.current, {
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.07))",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleBlur = () => {
    setFocused(false);
    if (wrapRef.current) {
      gsap.to(wrapRef.current, {
        filter: "drop-shadow(0 0px 0px rgba(0,0,0,0))",
        duration: 0.35,
        ease: "power2.out",
      });
    }
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full bg-white px-3.5 py-3 font-[family-name:var(--font-inter)] text-[14px] text-black placeholder:text-black/25 focus:outline-none transition-[border-color] duration-200 rounded-lg"
        style={{ border: `1px solid ${focused ? "#111" : "rgba(0,0,0,0.12)"}` }}
      />
      {hasVal && !focused && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2a7a2a" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── Formatters ───────────────────────────────────────────────────────────────
function fmtCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function fmtExp(v: string) {
  return v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1 / $2");
}

// ─── Payment Form ─────────────────────────────────────────────────────────────
function PaymentForm({ onPlace, placing }: { onPlace: () => void; placing: boolean }) {
  const [tab, setTab] = useState<"card" | "apple" | "paypal">("card");
  const [email, setEmail] = useState("");
  const [ship, setShip] = useState({ name: "", address: "", city: "", zip: "", country: "United States" });
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });

  const updateShip = (k: keyof typeof ship, v: string) => setShip((p) => ({ ...p, [k]: v }));
  const updateCard = (k: keyof typeof card, v: string) => setCard((p) => ({ ...p, [k]: v }));

  const cardDigits = card.number.replace(/\s/g, "");
  const cardBrand =
    cardDigits[0] === "4" ? "Visa" :
    cardDigits[0] === "5" ? "Mastercard" :
    cardDigits[0] === "3" ? "Amex" : null;

  const formValid =
    email && ship.name && ship.address && ship.city && ship.zip &&
    (tab !== "card" || (cardDigits.length === 16 && card.name && card.exp.length >= 7 && card.cvv.length >= 3));

  const prevValid = useRef(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const lockRef = useRef<SVGSVGElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const paymentFieldsRef = useRef<HTMLDivElement>(null);

  // Entrance: sections fade up smoothly with stagger
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const sections = Array.from(el.querySelectorAll("[data-section]")) as HTMLElement[];
    gsap.fromTo(
      sections,
      { opacity: 0, y: 20, filter: "blur(3px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.12,
        delay: 0.1,
        ease: "power3.out",
      }
    );
  }, []);

  // Tab switch: smooth fade-up
  useEffect(() => {
    const el = paymentFieldsRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 10, filter: "blur(2px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power3.out" }
    );
  }, [tab]);

  // CTA unlock: clip-path expand from center (المكان الوحيد اللي clip-path منطقي فيه)
  useEffect(() => {
    const isValid = !!formValid;
    if (isValid && !prevValid.current && btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { clipPath: "inset(0 50% 0 50%)" },
        { clipPath: "inset(0 0% 0 0%)", duration: 0.6, ease: "power3.out" }
      );
      if (lockRef.current) {
        gsap.fromTo(
          lockRef.current,
          { rotate: -15 },
          { rotate: 0, duration: 0.5, ease: "power3.out" }
        );
      }
    }
    prevValid.current = isValid;
  }, [formValid]);

  const tabStyle = (active: boolean) => ({
    border: active ? "1px solid #111" : "1px solid rgba(0,0,0,0.12)",
    background: active ? "#111" : "#fff",
    color: active ? "#fff" : "rgba(0,0,0,0.4)",
  });

  return (
    <div ref={formRef} className="space-y-8">

      <div data-section style={{ opacity: 0 }}>
        <p className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 uppercase tracking-[0.18em] mb-3">Contact</p>
        <Field id="email" type="email" placeholder="Email address" value={email} onChange={setEmail} />
      </div>

      <div data-section style={{ opacity: 0 }}>
        <p className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 uppercase tracking-[0.18em] mb-3">Delivery</p>
        <div className="space-y-2.5">
          <Field id="name" placeholder="Full name" value={ship.name} onChange={(v) => updateShip("name", v)} />
          <Field id="address" placeholder="Address" value={ship.address} onChange={(v) => updateShip("address", v)} />
          <div className="flex gap-2.5">
            <Field id="city" placeholder="City" value={ship.city} onChange={(v) => updateShip("city", v)} className="flex-1" />
            <Field id="zip" placeholder="ZIP" value={ship.zip} onChange={(v) => updateShip("zip", v)} className="w-28" />
          </div>
          <select
            value={ship.country}
            onChange={(e) => updateShip("country", e.target.value)}
            className="w-full bg-white border border-black/12 rounded-lg px-3.5 py-3 font-[family-name:var(--font-inter)] text-[14px] text-black focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer"
          >
            {["United States","United Kingdom","Canada","UAE","Saudi Arabia","Egypt","Germany","France","Australia"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div data-section style={{ opacity: 0 }}>
        <p className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 uppercase tracking-[0.18em] mb-3">Payment</p>
        <PaymentIcons />
        <div className="flex gap-2 mb-4">
          {(["card", "apple", "paypal"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setTab(m)}
              className="flex-1 py-2 rounded-lg font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.1em] transition-all duration-250 cursor-pointer"
              style={tabStyle(tab === m)}
            >
              {m === "card" ? "Card" : m === "apple" ? "Apple Pay" : "PayPal"}
            </button>
          ))}
        </div>

        <div ref={paymentFieldsRef}>
          {tab === "card" && (
            <div className="space-y-2.5">
              <div>
                <input
                  type="text"
                  placeholder="Card number"
                  value={card.number}
                  onChange={(e) => updateCard("number", fmtCard(e.target.value))}
                  className="w-full bg-white border border-black/12 rounded-lg px-3.5 py-3 font-[family-name:var(--font-inter)] text-[14px] text-black placeholder:text-black/25 focus:outline-none focus:border-black transition-colors tracking-[0.18em]"
                />
                {cardBrand && (
                  <p className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 mt-1 pl-1">{cardBrand}</p>
                )}
              </div>
              <Field id="cardName" placeholder="Name on card" value={card.name} onChange={(v) => updateCard("name", v)} />
              <div className="flex gap-2.5">
                <div className="flex-1">
                  <input
                    placeholder="MM / YY"
                    value={card.exp}
                    onChange={(e) => updateCard("exp", fmtExp(e.target.value))}
                    className="w-full bg-white border border-black/12 rounded-lg px-3.5 py-3 font-[family-name:var(--font-inter)] text-[14px] text-black placeholder:text-black/25 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="w-28">
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength={4}
                    value={card.cvv}
                    onChange={(e) => updateCard("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full bg-white border border-black/12 rounded-lg px-3.5 py-3 font-[family-name:var(--font-inter)] text-[14px] text-black placeholder:text-black/25 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === "apple" && (
            <div className="border border-black/10 rounded-xl p-5 text-center bg-[#F7F6F4]">
              <p className="font-[family-name:var(--font-inter)] text-[12px] text-black/40 mb-3">Confirm with Touch ID or Face ID</p>
              <div className="inline-flex items-center gap-2 bg-black text-white px-8 py-2.5 rounded-lg text-[13px] font-medium font-[family-name:var(--font-inter)] cursor-pointer">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Pay
              </div>
            </div>
          )}

          {tab === "paypal" && (
            <div className="border border-black/10 rounded-xl p-5 text-center bg-[#F7F6F4]">
              <p className="font-[family-name:var(--font-inter)] text-[12px] text-black/40 mb-3">You'll be redirected to PayPal</p>
              <div className="inline-flex items-center gap-2 bg-[#003087] text-white px-8 py-2.5 rounded-lg font-bold text-[13px] cursor-pointer">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="white">
                  <path d="M7 18H3.5C3.1 18 2.8 17.7 2.9 17.3L6.5 2c.1-.4.4-.7.8-.7h7.5C17.5 1.3 19.1 2 20 3.2c.8 1.1 1.1 2.6.8 4.2-.7 3.5-3 5.2-6.8 5.2H12l-.8 4.9c-.1.3-.4.5-.7.5h-3.5z"/>
                </svg>
                PayPal
              </div>
            </div>
          )}
        </div>
      </div>

      <div data-section style={{ opacity: 0 }}>
        <button
          ref={btnRef}
          onClick={onPlace}
          disabled={!formValid || placing}
          className={`w-full py-4 rounded-xl font-[family-name:var(--font-inter)] text-[13px] font-medium tracking-[0.1em] transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2.5
            ${formValid && !placing
              ? "bg-black text-white hover:bg-black/85"
              : "bg-black/10 text-black/25 cursor-not-allowed"
            }`}
        >
          {placing ? (
            <>
              <span className="w-3.5 h-3.5 border-[1.5px] border-white/30 border-t-white rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <svg
                ref={lockRef}
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ display: "inline-block", transformOrigin: "center" }}
              >
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Place Order
            </>
          )}
        </button>
        <p className="font-[family-name:var(--font-inter)] text-[10px] text-black/20 text-center mt-2.5">
          By ordering you agree to AURA's terms & privacy policy.
        </p>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ orderNum }: { orderNum: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const numRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.05 });

    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );

    // H1 — الوحيد اللي يستحق clip-path
    tl.fromTo(
      textRef.current,
      { clipPath: "inset(100% 0 0 0)", opacity: 0, filter: "blur(4px)" },
      { clipPath: "inset(0% 0 0 0)", opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
      "-=0.15"
    );

    tl.fromTo(
      [subRef.current, numRef.current],
      { opacity: 0, y: 10, filter: "blur(2px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.1, ease: "power3.out" },
      "-=0.4"
    );

    tl.fromTo(
      btnRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
      "-=0.3"
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6"
      style={{ opacity: 0 }}
    >
      <div className="relative w-20 h-20 mb-8">
        <svg className="absolute inset-0" width="80" height="80" viewBox="0 0 80 80">
          <style>{`
            @keyframes ring { to { stroke-dashoffset: 0 } }
            @keyframes check { to { stroke-dashoffset: 0 } }
            @keyframes pulse { 0%,100%{transform:scale(1) rotate(-90deg)} 50%{transform:scale(1.05) rotate(-90deg)} }
            .ring-a { animation: ring 0.75s cubic-bezier(0.16,1,0.3,1) 0.1s forwards }
            .check-a { animation: check 0.45s cubic-bezier(0.16,1,0.3,1) 0.75s forwards }
            .pulse-a { animation: pulse 0.55s cubic-bezier(0.16,1,0.3,1) 1.25s 1 }
          `}</style>
          <circle cx="40" cy="40" r="36" fill="none" stroke="#111" strokeWidth="1.5"
            className="ring-a pulse-a"
            style={{ strokeDasharray: 226, strokeDashoffset: 226, transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
          <polyline points="24,40 36,52 56,28" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className="check-a"
            style={{ strokeDasharray: 50, strokeDashoffset: 50 }}
          />
        </svg>
      </div>

      <span className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 uppercase tracking-[0.28em] mb-3">
        Order Confirmed
      </span>

      <h1
        ref={textRef}
        className="font-[family-name:var(--font-playfair)] text-[52px] sm:text-[60px] font-semibold text-black leading-none mb-3"
        style={{ opacity: 0 }}
      >
        Thank you.
      </h1>

      <p ref={subRef} className="font-[family-name:var(--font-inter)] text-[13px] text-black/40 mb-1.5" style={{ opacity: 0 }}>
        Your order is being prepared.
      </p>

      <p ref={numRef} className="font-[family-name:var(--font-inter)] text-[11px] text-black/20 uppercase tracking-[0.2em] mb-10" style={{ opacity: 0 }}>
        #{orderNum}
      </p>

      <Link
        ref={btnRef}
        href="/"
        className="bg-black text-white font-[family-name:var(--font-inter)] text-[11px] tracking-[0.18em] uppercase px-10 py-3.5 rounded-lg hover:bg-black/80 transition-colors"
        style={{ opacity: 0 }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}

// ─── Empty Cart ───────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1" opacity="0.15" className="mb-6">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <h2 className="font-[family-name:var(--font-playfair)] text-[30px] font-semibold text-black mb-2">Your bag is empty</h2>
      <p className="font-[family-name:var(--font-inter)] text-[13px] text-black/35 mb-8">Add items to continue.</p>
      <Link href="/" className="bg-black text-white font-[family-name:var(--font-inter)] text-[10px] tracking-[0.18em] uppercase px-10 py-3.5 rounded-lg hover:bg-black/80 transition-colors">
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
  const [orderNum] = useState(() => "AUR-" + Math.floor(Math.random() * 900000 + 100000));

  const headerRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cartCtx?.items && !synced) {
      setLocalItems([...cartCtx.items]);
      setSynced(true);
    }
  }, [cartCtx?.items, synced]);

  // Header entrance
  useEffect(() => {
    const header = headerRef.current;
    const border = borderRef.current;
    if (!header || !border) return;

    const eyebrow = header.querySelector("[data-eyebrow]") as HTMLElement;
    const h1 = header.querySelector("[data-h1]") as HTMLElement;
    const back = header.querySelector("[data-back]") as HTMLElement;

    const tl = gsap.timeline();

    tl.fromTo(
      eyebrow,
      { opacity: 0, filter: "blur(2px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power3.out" }
    );

    // H1 الوحيد اللي يستحق clip-path في الهيدر
    tl.fromTo(
      h1,
      { clipPath: "inset(100% 0 0 0)", filter: "blur(6px)", opacity: 0 },
      { clipPath: "inset(0% 0 0 0)", filter: "blur(0px)", opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.2"
    );

    tl.fromTo(
      back,
      { opacity: 0, filter: "blur(2px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out" },
      "-=0.5"
    );

    tl.fromTo(
      border,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.6, ease: "power3.out" },
      "-=0.35"
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setLocalItems((p) => p.filter((i) => i.id !== id));
  }, []);

  const handleQty = useCallback((id: string, qty: number) => {
    setLocalItems((p) => p.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, []);

  const handlePlace = () => {
    setPlacing(true);
    setTimeout(() => { setPlacing(false); setSuccess(true); }, 2200);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <Container><SuccessScreen orderNum={orderNum} /></Container>
      </main>
    );
  }

  if (synced && localItems.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <Container><EmptyCart /></Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-16 sm:pt-20 pb-24">
      <Container>

        <div ref={headerRef} className="pt-8 pb-8 mb-0">
          <div className="flex items-baseline justify-between">
            <div>
              <span
                data-eyebrow
                className="font-[family-name:var(--font-inter)] text-[10px] text-black/30 uppercase tracking-[0.22em]"
                style={{ opacity: 0 }}
              >AURA</span>
              <h1
                data-h1
                className="font-[family-name:var(--font-playfair)] text-[34px] sm:text-[44px] font-semibold text-black leading-tight mt-0.5"
                style={{ opacity: 0 }}
              >Checkout</h1>
            </div>
            <Link
              data-back
              href="/"
              className="font-[family-name:var(--font-inter)] text-[11px] text-black/30 uppercase tracking-[0.14em] hover:text-black transition-colors hidden sm:block"
              style={{ opacity: 0 }}
            >← Back</Link>
          </div>
        </div>

        <div
          ref={borderRef}
          className="border-b border-black/8 mb-10 mt-8"
          style={{ transformOrigin: "left center", scaleX: 0 }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 xl:gap-16 items-start">
          <PaymentForm onPlace={handlePlace} placing={placing} />
          <div className="lg:sticky lg:top-24">
            <OrderPanel items={localItems} onRemove={handleRemove} onQty={handleQty} />
          </div>
        </div>

      </Container>
    </main>
  );
}