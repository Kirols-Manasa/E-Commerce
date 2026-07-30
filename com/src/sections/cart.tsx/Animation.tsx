 "use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Helper: عدد الأعمدة الحالي حسب الشاشة ───────────────────────────────────
function getColumns(): number {
  if (typeof window === "undefined") return 4;
  const w = window.innerWidth;
  if (w < 640) return 2;
  if (w < 1024) return 3;
  return 4;
}

// ─── Helper: هل الجهاز touch ─────────────────────────────────────────────────
function isTouch(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none)").matches;
}

// ─── Section Entrance ─────────────────────────────────────────────────────────

export function useShopEntrance() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const labelRef   = useRef<HTMLSpanElement | null>(null);
  const titleRef   = useRef<HTMLHeadingElement | null>(null);
  const navRef     = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.set(labelRef.current, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
      gsap.set(titleRef.current, { clipPath: "inset(100% 0 0 0)", opacity: 1 });
      gsap.set(navRef.current,   { opacity: 0, y: 8 });

      const cards = gsap.utils.toArray<HTMLElement>(".shop-card");
      // y أصغر على موبايل
      const yVal = window.innerWidth < 640 ? 14 : 20;
      gsap.set(cards, { opacity: 0, y: yVal });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 78%",
        once: true,
        onEnter: () => {
          const cols = getColumns();
          const tl   = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.to(labelRef.current, { clipPath: "inset(0 0% 0 0)", duration: 0.65 }, 0)
            .to(titleRef.current, { clipPath: "inset(0% 0 0 0)", duration: 0.75 }, 0.1)
            .to(navRef.current,   { opacity: 1, y: 0, duration: 0.55 }, 0.28)
            .to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: {
                amount: 0.4,
                from: "start",
                grid: [Math.ceil(cards.length / cols), cols], // الـ grid الصح حسب الشاشة
              },
            }, 0.38);
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return { sectionRef, labelRef, titleRef, navRef };
}

// ─── Category Switch ──────────────────────────────────────────────────────────

export function useCategorySwitch() {
  const gridRef = useRef<HTMLDivElement | null>(null);

  const animateSwitch = useCallback(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".shop-card");
    if (!cards.length) return;

    const yExit = window.innerWidth < 640 ? -8 : -12;
    gsap.to(cards, {
      opacity: 0,
      y: yExit,
      duration: 0.22,
      ease: "power2.in",
      stagger: { amount: 0.1, from: "start" },
    });
  }, []);

  const animateEnter = useCallback(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".shop-card");
    if (!cards.length) return;

    const cols  = getColumns();
    const yEnter = window.innerWidth < 640 ? 12 : 16;

    gsap.set(cards, { opacity: 0, y: yEnter });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: "power3.out",
      stagger: {
        amount: 0.28,
        from: "start",
        grid: [Math.ceil(cards.length / cols), cols],
      },
    });
  }, []);

  return { gridRef, animateSwitch, animateEnter };
}

// ─── Card Hover (desktop only) ────────────────────────────────────────────────

export function useCardHover(cardEl: HTMLElement | null) {
  useEffect(() => {
    // على موبايل/touch: مفيش hover — مفيش listeners خالص
    if (!cardEl || isTouch()) return;

    const img  = cardEl.querySelector<HTMLElement>(".card-image");
    const info = cardEl.querySelector<HTMLElement>(".card-info");

    function onEnter() {
      if (img)  gsap.to(img,  { scale: 1.05, duration: 0.65, ease: "power3.out" });
      if (info) gsap.to(info, { y: -2,       duration: 0.4,  ease: "power3.out" });
    }

    function onLeave() {
      if (img)  gsap.to(img,  { scale: 1, duration: 0.6, ease: "power3.out" });
      if (info) gsap.to(info, { y: 0,     duration: 0.4, ease: "power3.out" });
    }

    cardEl.addEventListener("mouseenter", onEnter);
    cardEl.addEventListener("mouseleave", onLeave);
    return () => {
      cardEl.removeEventListener("mouseenter", onEnter);
      cardEl.removeEventListener("mouseleave", onLeave);
    };
  }, [cardEl]);
}

// ─── Heart Micro-interaction ──────────────────────────────────────────────────

export function animateHeartAdd(svgEl: SVGSVGElement) {
  gsap.fromTo(
    svgEl,
    { scale: 1 },
    {
      scale: 1.3,
      duration: 0.18,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => gsap.set(svgEl, { scale: 1 }),
    }
  );
}