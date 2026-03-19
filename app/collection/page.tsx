'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { useProductStore } from '@/store/productStore'
import { useState } from 'react'
import { Filter } from 'lucide-react'

export default function CollectionPage() {
  const products = useProductStore((state) => state.products)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('Featured')
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['All', 'flagship', 'mid-range', 'budget']
  const brands = Array.from(new Set(products.map(p => p.brand)))

  // Filtering Logic
  let filteredProducts = products.filter((p) => {
    const categoryMatch = !selectedCategory || selectedCategory === 'All' || p.category === selectedCategory
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(p.brand)
    
    let priceMatch = true
    if (selectedPriceRange === 'Under ₹20,000') priceMatch = p.price < 20000
    else if (selectedPriceRange === '₹20,000 - ₹50,000') priceMatch = p.price >= 20000 && p.price <= 50000
    else if (selectedPriceRange === '₹50,000 - ₹1,00,000') priceMatch = p.price > 50000 && p.price <= 100000
    else if (selectedPriceRange === '₹1,00,000+') priceMatch = p.price > 100000

    return categoryMatch && brandMatch && priceMatch
  })

  // Sorting Logic
  if (sortBy === 'Price: Low to High') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'Price: High to Low') {
    filteredProducts.sort((a, b) => b.price - a.price)
  }

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="py-12 sm:py-16 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">
                Browse
              </p>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
                Our Full Collection
              </h1>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
                Discover our curated selection of premium smartphones from the world's leading manufacturers
              </p>
            </div>
          </div>
        </section>

        {/* Collection */}
        <div className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-48 flex-shrink-0">
                <div className="sticky top-24">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden w-full flex items-center gap-2 px-4 py-3 border border-border rounded-lg text-foreground font-semibold mb-4 hover:bg-muted transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>

                  {/* Filters */}
                  <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-8`}>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                        Category
                      </h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                            className={`w-full text-left px-3 py-2 rounded transition-colors text-sm font-medium ${
                              (selectedCategory === category || (category === 'All' && !selectedCategory))
                                ? 'bg-foreground text-background'
                                : 'text-foreground hover:bg-muted'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                        Price Range
                      </h3>
                      <div className="space-y-2">
                        {['All Prices', 'Under ₹20,000', '₹20,000 - ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000+'].map((range) => (
                          <label key={range} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="priceRange"
                              className="rounded" 
                              checked={selectedPriceRange === range || (range === 'All Prices' && !selectedPriceRange)}
                              onChange={() => setSelectedPriceRange(range === 'All Prices' ? null : range)}
                            />
                            <span className="text-sm text-muted-foreground">{range}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                        Brand
                      </h3>
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <label key={brand} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded" 
                              checked={selectedBrands.includes(brand)}
                              onChange={() => handleBrandToggle(brand)}
                            />
                            <span className="text-sm text-muted-foreground">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCategory(null)
                        setSelectedBrands([])
                        setSelectedPriceRange(null)
                      }}
                      className="text-xs text-accent font-semibold hover:underline"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredProducts.length} products
                  </p>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="py-24 text-center space-y-4">
                    <p className="text-xl font-serif font-bold text-foreground">No products found</p>
                    <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory(null)
                        setSelectedBrands([])
                        setSelectedPriceRange(null)
                      }}
                      className="px-6 py-2 bg-foreground text-background rounded-lg font-semibold"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
