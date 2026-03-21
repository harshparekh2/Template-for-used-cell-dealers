'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
              HP Verse
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/collection"
              className="text-foreground hover:text-accent transition-colors text-sm font-medium"
            >
              Collection
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-accent transition-colors text-sm font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-accent transition-colors text-sm font-medium"
            >
              Contact
            </Link>
            <Link
              href="/admin"
              className="text-foreground hover:text-accent transition-colors text-sm font-medium"
            >
              Admin
            </Link>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-foreground hover:text-accent transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 pt-2">
            <div className="rounded-2xl border border-border bg-muted/30 p-3 space-y-2">
            <Link
              href="/collection"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-3 py-3 text-foreground hover:bg-background hover:text-accent transition-colors text-sm font-semibold"
            >
              Collection
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-3 py-3 text-foreground hover:bg-background hover:text-accent transition-colors text-sm font-semibold"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-3 py-3 text-foreground hover:bg-background hover:text-accent transition-colors text-sm font-semibold"
            >
              Contact
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-3 py-3 text-foreground hover:bg-background hover:text-accent transition-colors text-sm font-semibold"
            >
              Admin
            </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
