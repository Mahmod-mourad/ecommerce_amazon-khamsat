"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "@/hooks/use-translations"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, ShoppingCart, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export default function WishlistPage() {
  const { t } = useTranslations()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (!user) {
      router.push("/login?redirect=/wishlist")
      return
    }

    // In a real app, this would be an API call
    // For now, we'll just simulate fetching from localStorage
    const savedWishlist = localStorage.getItem(`wishlist-${user.id}`)
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
      }
    }
  }, [user, router])

  useEffect(() => {
    if (isClient && user) {
      localStorage.setItem(`wishlist-${user.id}`, JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, isClient, user])

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })

    toast({
      title: t("products.addedToCart"),
      description: item.name,
    })
  }

  const handleRemoveFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id))

    toast({
      title: t("wishlist.removed"),
      description: t("wishlist.itemRemoved"),
    })
  }

  if (!isClient || !user) {
    return null
  }

  // Sample wishlist items if empty
  const displayItems =
    wishlistItems.length > 0
      ? wishlistItems
      : [
          {
            id: "1",
            name: "Wireless Noise-Cancelling Headphones",
            price: 299.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "electronics",
          },
          {
            id: "2",
            name: "Smart Fitness Watch",
            price: 199.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "electronics",
          },
          {
            id: "3",
            name: "Organic Cotton T-Shirt",
            price: 29.99,
            image: "/placeholder.svg?height=300&width=300",
            category: "fashion",
          },
        ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("wishlist.title")}</h1>

      {displayItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">{t("wishlist.empty")}</h2>
          <p className="mt-2 text-muted-foreground">{t("wishlist.emptyMessage")}</p>
          <Button asChild className="mt-8">
            <Link href="/products">{t("wishlist.continueShopping")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <Link href={`/products/${item.id}`} className="relative block">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="aspect-square object-cover w-full transition-transform group-hover:scale-105"
                />
              </Link>
              <CardContent className="p-4">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-medium line-clamp-1 hover:underline">{item.name}</h3>
                </Link>
                <div className="mt-2 font-bold">${item.price.toFixed(2)}</div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button className="w-full" size="sm" onClick={() => handleAddToCart(item)}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t("products.addToCart")}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                >
                  <Trash className="w-4 h-4" />
                  <span className="sr-only">{t("wishlist.remove")}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
