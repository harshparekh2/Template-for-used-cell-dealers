import { NextResponse } from 'next/server'
import { readOrders, writeOrders } from '@/lib/server/ordersRepo'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(req: Request, context: RouteContext) {
  const { id } = await context.params
  const patch = (await req.json()) as { status?: 'Pending' | 'Processing' | 'Completed' | 'Cancelled' }
  const orders = await readOrders()
  const index = orders.findIndex((o) => o.id === id)
  if (index < 0) return NextResponse.json({ message: 'Order not found' }, { status: 404 })

  const updated = { ...orders[index], ...patch }
  orders[index] = updated
  await writeOrders(orders)
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, context: RouteContext) {
  const { id } = await context.params
  const orders = await readOrders()
  const next = orders.filter((o) => o.id !== id)
  if (next.length === orders.length) return NextResponse.json({ message: 'Order not found' }, { status: 404 })
  await writeOrders(next)
  return NextResponse.json({ success: true })
}

