import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOrderConfirmation } from "@/lib/email"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const data = await request.json()

  const order = await prisma.order.create({
    data: {
      userId: data.userId,
      total: data.total,
      status: "pending",
      paymentMethod: data.paymentMethod,
      shippingDetails: data.shippingDetails,
      items: {
        create: data.items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  })

  // Send order confirmation email
  await sendOrderConfirmation(order)

  return NextResponse.json(order)
}
