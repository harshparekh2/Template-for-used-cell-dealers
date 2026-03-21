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
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void
  updateOrderStatus: (id: string, status: Order['status']) => void
  deleteOrder: (id: string) => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [
            {
              ...order,
              id: `HPV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
              date: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              status: 'Pending',
            },
            ...state.orders,
          ],
        })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        })),
      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        })),
    }),
    {
      name: 'order-store',
    }
  )
)
