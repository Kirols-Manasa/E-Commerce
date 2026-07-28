 "use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const HIDE_THRESHOLD_PX = 60;
const SCROLL_MARGIN = 10;
const HEADER_TRANSITION =
  "transform 0.5s cubic-bezier(0.77, 0, 0.175, 1), " +
  "background-color 0.3s ease-in-out, " +
  "backdrop-filter 0.3s ease-in-out, " +
  "border-color 0.3s ease-in-out";

/**
 * forceDark: لو true (زي صفحات المنتج اللي خلفيتها بيضاء من الأول)، الهيدر
 * بيتصرف زي وضع "scrolled" دايمًا (خلفية بيضاء شفافة + نص أسود) حتى لو
 * لسه في أول الصفحة، عشان النص ميختفيش على خلفية بيضاء. لو false (زي
 * الهوم اللي فيه هيرو صورة/غامق)، الهيدر بيفضل شفاف بنص أبيض لحد ما تعمل سكرول.
 */
export function useHeader(threshold = 40, forceDark = false) {
  const [scrolled, setScrolled] = useState(false);
  const headerRef  = useRef<HTMLElement | null>(null);
  const brandRef   = useRef<HTMLSpanElement | null>(null);
  const icon1Ref   = useRef<HTMLButtonElement | null>(null);
  const icon2Ref   = useRef<HTMLButtonElement | null>(null);
  const tlRef      = useRef<gsap.core.Timeline | null>(null);
  const lastScrollY = useRef(0);
  const isHidden    = useRef(false);
  const rafId       = useRef<number | null>(null);
  const scrolled$   = useRef(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    header.style.transition = HEADER_TRANSITION;

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        const currentY  = window.scrollY;
        const goingDown = currentY > lastScrollY.current;

        if (goingDown && currentY > HIDE_THRESHOLD_PX && !isHidden.current) {
          isHidden.current = true;
          header.style.transform = "translateY(-100%)";
        } else if (!goingDown && isHidden.current) {
          isHidden.current = false;
          header.style.transform = "translateY(0%)";
        }

        const shouldBeScrolled = currentY > threshold && currentY > SCROLL_MARGIN;
        if (scrolled$.current !== shouldBeScrolled) {
          scrolled$.current = shouldBeScrolled;
          setScrolled(shouldBeScrolled);
        }

        lastScrollY.current = currentY;
        rafId.current = null;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [threshold]);

  useGSAP(
    () => {
      if (!headerRef.current) return;
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(
        brandRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.7, ease: "power3.out" }
      )
        .fromTo(
          [icon1Ref.current, icon2Ref.current],
          { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
          {
            clipPath: "circle(150% at 50% 50%)",
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.3"
        );
      tlRef.current = tl;
    },
    { scope: headerRef }
  );

  // لو forceDark، الهيدر بيتصرف وكأنه scrolled دايمًا (خلفية + نص غامق)
  const effectiveScrolled = forceDark || scrolled;

  const base    = "w-full fixed top-0 left-0 z-50 will-change-transform";
  const bgClass = effectiveScrolled
    ? "bg-white/80 backdrop-blur-md border-b border-black/10"
    : "bg-transparent border-b border-white/20";

  return {
    headerRef,
    brandRef,
    icon1Ref,
    icon2Ref,
    headerClass: `${base} ${bgClass}`,
    textColor: effectiveScrolled ? "text-black" : "text-white",
  };
}