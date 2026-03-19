'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { useProductStore } from '@/store/productStore'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const products = useProductStore((state) => state.products)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 lg:py-32 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">
                    Premium Smartphones
                  </p>
                  <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight text-balance">
                    Discover Luxury in Every Device
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                  Experience cutting-edge technology with white-glove service. Our carefully curated collection of premium smartphones combines innovation, design, and performance.
                </p>
                <div className="flex gap-4 pt-4">
                  <Link
                    href="/collection"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
                  >
                    Explore Collection
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>

              {/* Right Content - Hero Image Placeholder */}
              <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="text-center space-y-4">
                  <div className="text-muted-foreground text-sm">Featured Product Image</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">
                Our Collection
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
                  Featured Smartphones
                </h2>
                <Link
                  href="/collection"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition-colors"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 sm:py-24 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">
                Why LuxCell
              </p>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground max-w-2xl mx-auto">
                Premium Experience, Guaranteed
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Expert Curation',
                  description: 'Hand-selected premium devices from the world\'s leading manufacturers'
                },
                {
                  title: 'White-Glove Service',
                  description: 'Personal consultants to guide you through every step of your purchase'
                },
                {
                  title: 'Warranty & Support',
                  description: 'Comprehensive coverage and dedicated support for peace of mind'
                }
              ].map((feature, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl font-serif font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">
                Stay Updated
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                Exclusive Offers & Latest Arrivals
              </h2>
              <p className="text-muted-foreground mt-2">
                Subscribe to receive updates on new releases and special promotions
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
