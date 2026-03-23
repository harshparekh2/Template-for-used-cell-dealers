import { promises as fs } from 'fs'
import path from 'path'

export interface OrderItemLine {
  product: {
    id: string
    name: string
    brand: string
    price: number
    images: string[]
    specs: string[]
    description: string
    inStock: boolean
    condition: string
    category: string
    color?: string
    year?: string
    storage?: string
    ram?: string
    stockQuantity?: number
  }
  quantity: number
}

export interface StoredOrder {
  id: string
  customerName: string
  email: string
  phone: string
  address: string
  city?: string
  state?: string
  zip?: string
  country?: string
  paymentMethod?: 'UPI' | 'COD' | 'NetBanking'
  items: OrderItemLine[]
  total: number
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled'
  date: string
}

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'orders.json')

export const readOrders = async (): Promise<StoredOrder[]> => {
  try {
    const content = await fs.readFile(dataFile, 'utf-8')
    return JSON.parse(content) as StoredOrder[]
  } catch {
    return []
  }
}

export const writeOrders = async (orders: StoredOrder[]) => {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(orders, null, 2), 'utf-8')
}

export const createOrderId = () => {
  const n = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `HPV-${n}`
}

export const nowOrderDate = () =>
  new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

