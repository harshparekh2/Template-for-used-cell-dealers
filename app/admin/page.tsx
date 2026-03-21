'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/adminStore'
import { useRouter } from 'next/navigation'
import { Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useAdminStore((state) => state.login)
  const isLoggedIn = useAdminStore((state) => state.isLoggedIn)
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/admin/dashboard')
    }
  }, [isLoggedIn, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (login(email, password)) {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid email or password')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">HP Verse</h1>
          <p className="text-muted-foreground">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <Lock className="w-12 h-12 text-accent mx-auto" />
            <h2 className="text-2xl font-serif font-bold text-foreground">Sign In</h2>
            <p className="text-sm text-muted-foreground">
              Access the admin dashboard to manage products and orders
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="admin@hpverse.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground text-center mb-3">Demo Credentials</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Email: <span className="text-foreground font-mono">admin@hpverse.com</span></p>
              <p>Password: <span className="text-foreground font-mono">admin123</span></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Not an admin?{' '}
            <a href="/" className="text-accent hover:text-accent/80 font-semibold transition-colors">
              Back to Store
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
