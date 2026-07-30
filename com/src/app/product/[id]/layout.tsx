import { type Metadata } from "next";
import { products } from "@/data/products";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description ?? `Shop ${product.name} at AURA.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}