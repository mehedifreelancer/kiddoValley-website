// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProductDetails from "@/app/components/shared/ProductDetails";
import { getProductBySlug } from "../product.service";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container-md mx-auto py-10 mt-2 md:mt-4">
      <ProductDetails product={product} />
    </div>
  );
}
