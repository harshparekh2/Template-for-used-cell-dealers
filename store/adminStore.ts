import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AdminUser {
  id: string
  email: string
  password: string
  name: string
}

interface AdminStore {
  isLoggedIn: boolean
  admin: AdminUser | null
  login: (email: string, password: string) => boolean
  logout: () => void
  setAdmin: (admin: AdminUser) => void
}

const defaultAdmins: AdminUser[] = [
  {
    id: '1',
    email: 'admin@hpverse.com',
    password: 'admin123',
    name: 'Admin User',
  },
]

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      admin: null,
      login: (email, password) => {
        const adminUser = defaultAdmins.find(
          (a) => a.email === email && a.password === password
        )
        if (adminUser) {
          set({
            isLoggedIn: true,
            admin: adminUser,
          })
          return true
        }
        return false
      },
      logout: () => set({ isLoggedIn: false, admin: null }),
      setAdmin: (admin) => set({ admin, isLoggedIn: true }),
    }),
    {
      name: 'admin-store',
    }
  )
)
