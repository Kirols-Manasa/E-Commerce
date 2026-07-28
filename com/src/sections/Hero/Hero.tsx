 "use client";

import Image from "next/image";
import Container from "@/Container";
import { useHeroAnimation } from "./Animation";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { labelRef, titleRef, subRef, btn1Ref, btn2Ref, scrollRef } = useHeroAnimation();
  const router = useRouter();

  function handleShopNow() {
    router.push("/product/men-1");
  }

  function handleSale() {
    window.dispatchEvent(new CustomEvent("set-category", { detail: "SALE" }));
    setTimeout(() => {
      const target = document.getElementById("shop");
      if (!target) return;
      const lenis = (window as unknown as Record<string, any>).lenis;
      const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 88;
      const offset = -(headerHeight + 24);
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(target, { offset, duration: 1.2 });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-white">

      {/* Wrapper يجمع الصورة والـ overlay سوا عشان يختفوا مع بعض بنفس الفيد */}
       <div
  className="absolute inset-0"
  style={{
    maskImage: "linear-gradient(to bottom, black 0%, black 82%, transparent 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 82%, transparent 100%)",
  }}
>
        <Image
          src="/imgehero/hero.png"
          alt="Hero"
          fill
          priority
          className="object-cover object-[75%_top]"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <Container className="relative z-10 h-full flex items-center">
        <div className="max-w-[500px] flex flex-col gap-4 sm:gap-6">

          <span
            ref={labelRef}
            className="font-[family-name:var(--font-inter)] text-label-sm text-white/70 tracking-[0.2em] uppercase"
            style={{ willChange: "transform, opacity" }}
          >
            New Collection 2026
          </span>

          <h1
            ref={titleRef}
            className="font-[family-name:var(--font-playfair)] text-[48px] sm:text-[60px] lg:text-display text-white leading-[1.1]"
            style={{ willChange: "transform, opacity" }}
          >
            Style for <br />
            <span className="italic">Everyone.</span>
          </h1>

          <p
            ref={subRef}
            className="font-[family-name:var(--font-inter)] text-body-md sm:text-body-lg text-white/80 max-w-[380px]"
            style={{ willChange: "transform, opacity" }}
          >
            Discover our latest collections — Men, Women, Sneakers, Accessories, and unmissable Sale deals.
          </p>

          <div className="flex items-center gap-4 mt-2">
            <button
              ref={btn1Ref}
              onClick={handleShopNow}
              className="font-[family-name:var(--font-inter)] text-body-md bg-white text-black px-8 py-3 rounded-full hover:bg-white/90 transition-all duration-300 cursor-pointer"
              style={{ willChange: "transform, opacity" }}
            >
              Shop Now
            </button>
            <button
              ref={btn2Ref}
              onClick={handleSale}
              className="font-[family-name:var(--font-inter)] text-body-md text-white border border-white/50 px-8 py-3 rounded-full hover:border-white transition-all duration-300 cursor-pointer"
              style={{ willChange: "transform, opacity" }}
            >
              Sale
            </button>
          </div>

        </div>
      </Container>

      <div
  ref={scrollRef}
  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
  style={{ willChange: "transform, opacity" }}
>
  <span className="font-[family-name:var(--font-inter)] text-label-sm text-black/60 tracking-[0.2em] uppercase">Scroll</span>
  <div className="w-[1px] h-10 bg-black/25 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-black/70 animate-bounce" />
  </div>
</div>

    </section>
  );
}