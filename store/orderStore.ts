import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from './cartStore'

export interface Order {
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
  items: CartItem[]
  total: number
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled'
  date: string
}

interface OrderStore {
  orders: Order[]
  loadOrders: () => Promise<void>
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<Order>
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      loadOrders: async () => {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        if (!res.ok) return
        const data: Order[] = await res.json()
        set({ orders: data })
      },
      addOrder: async (order) => {
        const payload = {
          customerName: order.customerName,
          email: order.email,
          phone: order.phone,
          address: order.address,
          city: order.city,
          state: order.state,
          zip: order.zip,
          country: order.country,
          paymentMethod: order.paymentMethod,
          items: order.items.map((line) => ({
            productId: line.product.id,
            quantity: line.quantity,
          })),
        }

        const res = await fetch('/api/orders/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const msg = await res.json().catch(() => null)
          throw new Error(msg?.message || 'Could not complete order. Please try again.')
        }

        const created: Order = await res.json()
        set((state) => ({ orders: [created, ...state.orders] }))
        return created
      },
      updateOrderStatus: async (id, status) => {
        const res = await fetch(`/api/orders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
        if (!res.ok) return
        set((state) => ({
          orders: state.orders.map((order) => (order.id === id ? { ...order, status } : order)),
        }))
      },
      deleteOrder: async (id) => {
        const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
        if (!res.ok) return
        set((state) => ({ orders: state.orders.filter((order) => order.id !== id) }))
      },
    }),
    {
      name: 'order-store',
    }
  )
)
