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
    openGraph: {
      title: `${product.name} | AURA`,
      description: product.description ?? `Shop ${product.name} at AURA.`,
      images: [{ url: product.image, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | AURA`,
      description: product.description ?? `Shop ${product.name} at AURA.`,
      images: [product.image],
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description ?? `Shop ${product.name} at AURA.`,
        image: product.image,
        brand: { "@type": "Brand", name: "AURA" },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `https://aura-store-vert.vercel.app/product/${product.id}`,
        },
        ...(product.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount ?? 1,
          },
        }),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}