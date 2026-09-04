import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/queries";
import ProductViewClient from "@/components/product/ProductView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Товар не найден | Маляр" };

  return {
    title: product.seoTitle ?? `${product.name} — купить в Калининграде | Маляр`,
    description: product.seoDescription ?? product.subtitle ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return <ProductViewClient product={product} />;
}
