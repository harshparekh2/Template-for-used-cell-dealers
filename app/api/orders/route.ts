import { NextResponse } from 'next/server'
import { readOrders } from '@/lib/server/ordersRepo'

export async function GET() {
  const orders = await readOrders()
  return NextResponse.json(orders)
}

