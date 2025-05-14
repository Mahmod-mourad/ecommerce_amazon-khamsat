import { ProductDetails } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-products"
import { ProductReviews } from "@/components/product-reviews"
import { getProductById, getRelatedProducts } from "@/lib/products"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category)

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
      <ProductReviews productId={params.id} />
      <RelatedProducts products={relatedProducts} />
    </div>
  )
}
