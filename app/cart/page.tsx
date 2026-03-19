'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight, Image as ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { formatINR } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) return null

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center space-y-6">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-6">
                Start exploring our premium collection of smartphones
              </p>
            </div>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-border">
          <h1 className="text-4xl font-serif font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        {/* Cart Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 sm:gap-6 p-4 sm:p-6 border border-border rounded-lg hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product.id}`}
                      className="hover:text-accent transition-colors"
                    >
                      <h3 className="text-lg font-serif font-bold text-foreground truncate">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">{item.product.brand}</p>
                    <p className="text-2xl font-serif font-bold text-foreground mt-3">
                      {formatINR(item.product.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-border rounded-lg w-fit">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 hover:bg-muted transition-colors"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-muted transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right flex flex-col justify-between">
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="text-xl font-serif font-bold text-foreground">
                      {formatINR(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-muted/30 border border-border rounded-lg p-6 sticky top-24 space-y-6">
                <h2 className="text-xl font-serif font-bold text-foreground">Order Summary</h2>

                <div className="space-y-3 border-b border-border pb-4">
                  {[
                    { label: 'Subtotal', value: getTotal() },
                    { label: 'Shipping', value: 0 },
                    { label: 'GST (estimated 12%)', value: Math.round(getTotal() * 0.12) }
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="text-foreground font-semibold">
                        {formatINR(row.value)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-3xl font-serif font-bold text-foreground">
                    {formatINR(getTotal() + Math.round(getTotal() * 0.12))}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full px-6 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => clearCart()}
                  className="w-full px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
                >
                  Clear Cart
                </button>

                <Link
                  href="/collection"
                  className="block text-center text-accent hover:text-accent/80 text-sm font-semibold transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Info */}
                <div className="bg-background border border-border rounded p-4 space-y-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Complimentary Services
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ Expert consultation</li>
                    <li>✓ Free shipping</li>
                    <li>✓ 30-day returns</li>
                    <li>✓ 2-year warranty</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
