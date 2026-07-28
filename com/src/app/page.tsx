 import { Suspense } from "react";
import Hero from "@/sections/Hero/Hero";
import ShopSection from "@/sections/cart.tsx/cart";

export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense fallback={null}>
        <ShopSection />
      </Suspense>
    </main>
  );
}