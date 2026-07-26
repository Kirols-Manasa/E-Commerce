 "use client";

import { useEffect, useRef } from "react";

export function useHeroAnimation() {
  const labelRef  = useRef<HTMLSpanElement | null>(null);
  const titleRef  = useRef<HTMLHeadingElement | null>(null);
  const subRef    = useRef<HTMLParagraphElement | null>(null);
  const btn1Ref   = useRef<HTMLButtonElement | null>(null);
  const btn2Ref   = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const els = [labelRef, titleRef, subRef, btn1Ref, btn2Ref].map(r => r.current).filter(Boolean) as HTMLElement[];

    els.forEach(el => {
      el.style.transform = "scale(0) rotate(-5deg)";
      el.style.opacity   = "0";
    });

    els.forEach((el, j) => {
      setTimeout(() => {
        el.style.transition = `all ${0.7 + j * 0.04}s cubic-bezier(0.34, 1.6, 0.64, 1)`;
        el.style.transform  = "scale(1) rotate(0deg)";
        el.style.opacity    = "1";
      }, 100 + j * 130);
    });

    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.style.opacity   = "0";
      scrollEl.style.transform = "translateY(10px)";
      setTimeout(() => {
        scrollEl.style.transition = "all 0.7s cubic-bezier(0.34, 1.6, 0.64, 1)";
        scrollEl.style.transform  = "translateY(0)";
        scrollEl.style.opacity    = "1";
      }, 100 + 5 * 130);
    }
  }, []);

  return { labelRef, titleRef, subRef, btn1Ref, btn2Ref, scrollRef };
}