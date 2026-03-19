import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  images: string[]
  specs: string[]
  description: string
  inStock: boolean
  condition: string // e.g., "Like New", "Excellent", "Good", "Fair"
  category: string
}

interface ProductStore {
  products: Product[]
  setProducts: (products: Product[]) => void
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    price: 119900,
    images: ['/products/iphone-16-pro.jpg'],
    specs: ['6.3" Display', 'A18 Pro', '48MP Camera'],
    description: 'Latest flagship iPhone with advanced AI features',
    inStock: true,
    condition: 'Like New',
    category: 'flagship'
  },
  {
    id: '2',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 124900,
    images: ['/products/galaxy-s24-ultra.jpg'],
    specs: ['6.8" Display', 'Snapdragon 8 Gen 3', '200MP Camera'],
    description: 'Premium Android experience with cutting-edge technology',
    inStock: true,
    condition: 'Excellent',
    category: 'flagship'
  },
]

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: mockProducts,
      setProducts: (products) => set({ products }),
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...product, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedProduct } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'product-store',
    }
  )
)
