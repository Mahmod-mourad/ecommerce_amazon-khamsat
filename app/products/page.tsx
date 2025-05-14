import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Pagination } from "@/components/pagination"
import { getProducts } from "@/lib/products"

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <ProductFilters />
        </div>
        <div className="w-full md:w-3/4">
          <ProductGrid products={products} />
          <Pagination totalPages={5} currentPage={1} />
        </div>
      </div>
    </div>
  )
}
