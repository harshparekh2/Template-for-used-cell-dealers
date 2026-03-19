'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useProductStore } from '@/store/productStore'
import { useCartStore } from '@/store/cartStore'
import { useState, use } from 'react'
import { Star, ShoppingCart, Heart, Share2, Check, ShieldCheck, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatINR } from '@/lib/utils'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params)
  const products = useProductStore((state) => state.products)
  const product = products.find((p) => p.id === id)
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
            <Link
              href="/collection"
              className="inline-block px-6 py-2 bg-foreground text-background rounded-lg font-semibold hover:bg-foreground/90 transition-colors"
            >
              Back to Collection
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const images = product.images.length > 0 ? product.images : ['/placeholder.jpg']

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/collection" className="hover:text-foreground">Collection</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {/* Product Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
                  {images[activeImage] ? (
                    <Image
                      src={images[activeImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          activeImage === idx ? 'border-accent' : 'border-transparent'
                        }`}
                      >
                        <Image src={img} alt={`${product.name} ${idx + 1}`} width={100} height={100} className="object-cover w-full h-full" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm uppercase tracking-wider text-accent font-semibold mb-2">
                      {product.brand}
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
                      {product.name}
                    </h1>
                    
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Condition: {product.condition}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="py-6 border-y border-border">
                    <p className="text-sm text-muted-foreground mb-2">Price</p>
                    <p className="text-5xl font-serif font-bold text-foreground">
                      {formatINR(product.price)}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                {/* Key Specs */}
                <div>
                  <h3 className="text-lg font-serif font-bold text-foreground mb-4">Key Specifications</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.specs.map((spec, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-4 border-t border-border">
                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground">Quantity:</span>
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-muted transition-colors"
                      >
                        −
                      </button>
                      <span className="px-6 py-2 font-semibold text-foreground">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                        isAdded
                          ? 'bg-accent/20 text-accent'
                          : 'bg-foreground text-background hover:bg-foreground/90'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button className="px-6 py-4 border border-border rounded-lg hover:bg-muted transition-colors">
                      <Heart className="w-5 h-5 text-foreground" />
                    </button>
                    <button className="px-6 py-4 border border-border rounded-lg hover:bg-muted transition-colors">
                      <Share2 className="w-5 h-5 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 text-sm">
                  {product.inStock ? (
                    <>
                      <Check className="w-5 h-5 text-accent" />
                      <span className="text-foreground font-semibold">In Stock - Free India-wide Shipping</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Out of Stock</span>
                  )}
                </div>

                {/* Additional Info */}
                <div className="space-y-3 border-t border-border pt-6">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Why LuxCell India?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">→</span>
                      <span>Certified 40-point quality check on all pre-owned devices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">→</span>
                      <span>1-year LuxCell Warranty on every phone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">→</span>
                      <span>Free data transfer and initial setup at your doorstep</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-16 sm:py-24 border-t border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Similar Devices</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products
                .filter((p) => p.id !== product.id)
                .slice(0, 3)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="group flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {p.images[0] ? (
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        {p.brand}
                      </p>
                      <h3 className="text-lg font-serif font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                        {p.name}
                      </h3>
                      <p className="text-xl font-serif font-bold text-foreground mt-auto">
                        {formatINR(p.price)}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
