import type { Product } from "@/types"

// This is a mock implementation. In a real app, this would fetch from an API
export async function getProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "1",
      name: "Wireless Noise-Cancelling Headphones",
      description: "Premium wireless headphones with active noise cancellation",
      price: 299.99,
      images: ["/placeholder.svg?height=300&width=300"],
      category: "electronics",
      rating: 4.5,
      stock: 15,
      featured: true,
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      description: "Track your fitness goals with this advanced smartwatch",
      price: 199.99,
      images: ["/placeholder.svg?height=300&width=300"],
      category: "electronics",
      rating: 4.3,
      stock: 20,
      featured: true,
    },
    {
      id: "3",
      name: "Organic Cotton T-Shirt",
      description: "Comfortable and eco-friendly cotton t-shirt",
      price: 29.99,
      images: ["/placeholder.svg?height=300&width=300"],
      category: "fashion",
      rating: 4.0,
      stock: 50,
      featured: true,
    },
    {
      id: "4",
      name: "Professional Blender",
      description: "High-performance blender for smoothies and food preparation",
      price: 149.99,
      images: ["/placeholder.svg?height=300&width=300"],
      category: "home",
      rating: 4.7,
      stock: 10,
      featured: true,
    },
    {
      id: "5",
      name: "Leather Wallet",
      description: "Genuine leather wallet with multiple card slots",
      price: 49.99,
      images: ["/placeholder.svg?height=300&width=300"],
      category: "fashion",
      rating: 4.2,
      stock: 30,
      featured: false,
    },
    {
      id: "6",
      name: "Stainless Steel Water Bottle",
      description: "Insulated water bottle that keeps drinks cold for 24 hours",
      price: 24.99,
      images: ["/placeholder.svg?height=300&width=300"],
      category: "home",
      rating: 4.6,
      stock: 40,
      featured: false,
    },
  ]
}

export async function getProductById(id: string): Promise<Product | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const products = await getProducts()
  const product = products.find((p) => p.id === id)

  if (!product) {
    return null
  }

  // Add more images for the product detail page
  return {
    ...product,
    images: [
      product.images[0],
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    description:
      product.description +
      " " +
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam ultricies, nisl nunc ultricies nunc, quis ultricies nisl nunc quis nisl. Sed euismod, diam quis aliquam ultricies, nisl nunc ultricies nunc, quis ultricies nisl nunc quis nisl.",
  }
}

export async function getRelatedProducts(category: string): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const products = await getProducts()
  return products.filter((p) => p.category === category).slice(0, 4)
}
