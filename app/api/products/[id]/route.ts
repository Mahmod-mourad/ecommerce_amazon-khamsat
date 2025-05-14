import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  })

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json()

  const product = await prisma.product.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json(product)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.product.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}
