import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const query = searchParams.get("query")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const skip = (page - 1) * limit

  const where: any = {}

  if (category) {
    where.category = category
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ]
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    },
  })
}

export async function POST(request: Request) {
  const data = await request.json()

  const product = await prisma.product.create({
    data,
  })

  return NextResponse.json(product)
}
