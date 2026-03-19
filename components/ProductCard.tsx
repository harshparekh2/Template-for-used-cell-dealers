'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/store/productStore'
import { ShoppingCart, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatINR } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <div className="group flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-muted to-muted/50 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Product Image</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-background/90 backdrop-blur-sm border border-border rounded text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-accent" />
            {product.condition}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Brand */}
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          {product.brand}
        </p>

        {/* Title */}
        <Link href={`/product/${product.id}`} className="mb-2">
          <h3 className="text-lg font-serif font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Specs */}
        <ul className="text-xs text-muted-foreground mb-4 space-y-1">
          {product.specs.slice(0, 2).map((spec, index) => (
            <li key={index} className="line-clamp-1">• {spec}</li>
          ))}
        </ul>

        {/* Price and Button - Flex at bottom */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-xl font-serif font-bold text-foreground">
              {formatINR(product.price)}
            </p>
          </div>
          <button
            onClick={() => addItem(product, 1)}
            className="p-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
