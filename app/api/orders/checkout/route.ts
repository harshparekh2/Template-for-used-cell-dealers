import { NextResponse } from 'next/server'
import { readProducts, writeProducts } from '@/lib/server/productsRepo'
import { Product } from '@/lib/productsSeed'
import {
  createOrderId,
  nowOrderDate,
  readOrders,
  writeOrders,
  StoredOrder,
  OrderItemLine,
} from '@/lib/server/ordersRepo'

type CheckoutItem = { productId: string; quantity: number }

export async function POST(req: Request) {
  const body = (await req.json()) as {
    customerName: string
    email: string
    phone: string
    address: string
    city?: string
    state?: string
    zip?: string
    country?: string
    paymentMethod?: 'UPI' | 'COD' | 'NetBanking'
    items: CheckoutItem[]
  }

  if (!body.items?.length) {
    return NextResponse.json({ message: 'No items provided' }, { status: 400 })
  }

  const products = await readProducts()
  const beforeProducts = products.map((p) => ({ ...p }))

  // Validate stock first
  for (const line of body.items) {
    const product = products.find((p) => p.id === line.productId)
    const availableQty = Math.max(
      0,
      Math.floor(Number(product?.stockQuantity ?? (product?.inStock ? 1 : 0)))
    )
    const requestedQty = Math.max(0, Math.floor(Number(line.quantity ?? 0)))
    if (!product || availableQty < requestedQty || requestedQty <= 0) {
      return NextResponse.json(
        { message: 'Not enough stock for one or more items' },
        { status: 409 }
      )
    }
  }

  // Apply stock decrements
  for (const line of body.items) {
    const index = products.findIndex((p) => p.id === line.productId)
    const requestedQty = Math.max(0, Math.floor(Number(line.quantity ?? 0)))
    const currentQty = Math.max(
      0,
      Math.floor(Number(products[index]?.stockQuantity ?? (products[index]?.inStock ? 1 : 0)))
    )
    const nextQty = Math.max(0, currentQty - requestedQty)
    products[index] = {
      ...products[index],
      stockQuantity: nextQty,
      inStock: nextQty > 0,
    }
  }

  await writeProducts(products)

  // Build order item lines (snapshot before decrement)
  const orderItems: OrderItemLine[] = body.items.map((line) => {
    const snap = beforeProducts.find((p) => p.id === line.productId) as Product
    const quantity = Math.max(0, Math.floor(Number(line.quantity ?? 0)))
    return {
      product: {
        id: snap.id,
        name: snap.name,
        brand: snap.brand,
        price: snap.price,
        images: snap.images,
        specs: snap.specs,
        description: snap.description,
        inStock: snap.inStock,
        condition: snap.condition,
        category: snap.category,
        color: snap.color,
        year: snap.year,
        storage: snap.storage,
        ram: snap.ram,
        stockQuantity: snap.stockQuantity,
      },
      quantity,
    }
  })

  const subtotal = orderItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const total = subtotal + Math.round(subtotal * 0.12)

  const order: StoredOrder = {
    id: createOrderId(),
    customerName: body.customerName,
    email: body.email,
    phone: body.phone,
    address: body.address,
    city: body.city,
    state: body.state,
    zip: body.zip,
    country: body.country,
    paymentMethod: body.paymentMethod,
    items: orderItems,
    total,
    status: 'Pending',
    date: nowOrderDate(),
  }

  const existing = await readOrders()
  await writeOrders([order, ...existing])

  return NextResponse.json(order, { status: 201 })
}

