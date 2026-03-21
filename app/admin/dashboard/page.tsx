'use client'

import { useAdminStore } from '@/store/adminStore'
import { useProductStore, Product } from '@/store/productStore'
import { useOrderStore, Order } from '@/store/orderStore'
import { useRouter } from 'next/navigation'
import { LogOut, Plus, Edit, Trash2, Package, ShoppingCart, Users, TrendingUp, X, Image as ImageIcon, Eye } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { formatINR } from '@/lib/utils'

export default function AdminDashboardPage() {
  const isLoggedIn = useAdminStore((state) => state.isLoggedIn)
  const admin = useAdminStore((state) => state.admin)
  const logout = useAdminStore((state) => state.logout)
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore()
  const { orders, updateOrderStatus, deleteOrder } = useOrderStore()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview')
  const [isHydrated, setIsHydrated] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Product Form State
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    brand: '',
    price: 0,
    images: ['/icon.svg'],
    specs: [],
    description: '',
    inStock: true,
    condition: 'Excellent',
    category: 'flagship',
    color: '',
    year: '',
    storage: '',
    ram: '',
    stockQuantity: 1
  })

  const MAX_IMAGES = 6
  const MAX_FILE_SIZE_MB = 10

  const [uploadedImages, setUploadedImages] = useState<string[]>(['/icon.svg'])
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  /** One line per bullet on product page “Key specifications” */
  const [specsText, setSpecsText] = useState('')

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Failed to read image file'))
      reader.readAsDataURL(file)
    })

  // Redirect if not logged in and handle hydration
  useEffect(() => {
    setIsHydrated(true)
    if (!isLoggedIn) {
      router.push('/admin')
    }
  }, [isLoggedIn, router])

  if (!isHydrated) return null

  const handleLogout = () => {
    logout()
    router.push('/admin')
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      brand: '',
      price: 0,
      images: ['/icon.svg'],
      specs: [],
      description: '',
      inStock: true,
      condition: 'Excellent',
      category: 'flagship',
      color: '',
      year: '',
      storage: '',
      ram: '',
      stockQuantity: 1
    })
    setUploadedImages(['/icon.svg'])
    setImageError(null)
    setSpecsText('')
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      ...product,
      color: product.color ?? '',
      year: product.year ?? '',
      storage: product.storage ?? '',
      ram: product.ram ?? '',
      stockQuantity: Number(product.stockQuantity ?? (product.inStock ? 1 : 0)),
    })
    setUploadedImages(product.images?.length ? product.images : ['/icon.svg'])
    setImageError(null)
    setSpecsText((product.specs ?? []).join('\n'))
    setIsModalOpen(true)
  }

  const handleImageFiles = async (files: File[]) => {
    setImageError(null)
    if (files.length === 0) return

    const oversized = files.find((f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024)
    if (oversized) {
      setImageError(`Each image must be <= ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    const nonPlaceholder = uploadedImages.filter((img) => img !== '/icon.svg')
    const newImageUrls = await Promise.all(files.map(readFileAsDataUrl))
    const merged = [...nonPlaceholder, ...newImageUrls].slice(0, MAX_IMAGES)
    const finalImages = merged.length ? merged : ['/icon.svg']
    setUploadedImages(finalImages)
    setFormData((prev) => ({ ...prev, images: finalImages }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submissionImages = uploadedImages?.length ? uploadedImages : ['/icon.svg']
    const specs = specsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
    const normalizedStock = Math.max(0, Math.floor(Number(formData.stockQuantity ?? 0)))
    const submissionData = {
      ...formData,
      images: submissionImages,
      specs,
      stockQuantity: normalizedStock,
      inStock: normalizedStock > 0,
    }
    
    if (editingProduct) {
      updateProduct(editingProduct.id, submissionData)
    } else {
      addProduct(submissionData)
    }
    setIsModalOpen(false)
  }

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Total Customers',
      value: new Set(orders.map(o => o.email)).size,
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Revenue',
      value: formatINR(orders.reduce((sum, o) => sum + o.total, 0)),
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-foreground">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border border-border rounded-lg bg-background"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Brand</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border border-border rounded-lg bg-background"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border border-border rounded-lg bg-background"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Category</label>
                  <select
                    className="w-full p-2 border border-border rounded-lg bg-background"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="flagship">Flagship</option>
                    <option value="mid-range">Mid-range</option>
                    <option value="budget">Budget</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Condition</label>
                  <select
                    className="w-full p-2 border border-border rounded-lg bg-background"
                    value={formData.condition}
                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Available Quantity</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full p-2 border border-border rounded-lg bg-background"
                    value={Number(formData.stockQuantity ?? 0)}
                    onChange={e => {
                      const qty = Math.max(0, Number(e.target.value))
                      setFormData({ ...formData, stockQuantity: qty, inStock: qty > 0 })
                    }}
                    placeholder="e.g., 5"
                  />
                  <p className="text-[10px] text-muted-foreground italic">Example: 5 means "5 pieces left".</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Color</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-border rounded-lg bg-background"
                    value={formData.color ?? ''}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., Black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Year</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-border rounded-lg bg-background"
                    value={formData.year ?? ''}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g., 2023"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Storage</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-border rounded-lg bg-background"
                    value={formData.storage ?? ''}
                    onChange={e => setFormData({ ...formData, storage: e.target.value })}
                    placeholder="e.g., 128GB"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">RAM</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-border rounded-lg bg-background"
                    value={formData.ram ?? ''}
                    onChange={e => setFormData({ ...formData, ram: e.target.value })}
                    placeholder="e.g., 8GB"
                  />
                </div>
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Product Images (upload)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files ?? [])
                      await handleImageFiles(files)
                      e.target.value = ''
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3 py-2 border border-border rounded-lg hover:bg-muted text-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Add More Photos
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {uploadedImages.filter((img) => img !== '/icon.svg').length}/{MAX_IMAGES} photos
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, idx) => (
                      <div key={`${img}-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                        <img src={img} alt={`Product image ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                        <button
                          type="button"
                          className="absolute top-1 right-1 p-1 rounded bg-background/80 backdrop-blur border border-border hover:bg-background"
                          onClick={() => {
                            const next = uploadedImages.filter((_, i) => i !== idx)
                            const final = next.length ? next : ['/icon.svg']
                            setUploadedImages(final)
                            setFormData((prev) => ({ ...prev, images: final }))
                          }}
                          aria-label="Remove image"
                        >
                          <Trash2 className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {imageError ? (
                    <p className="text-xs text-destructive mt-1">{imageError}</p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground italic mt-1">
                      Images are stored in your browser (localStorage). Up to {MAX_IMAGES} photos.
                    </p>
                  )}

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImages(['/icon.svg'])
                        setFormData((prev) => ({ ...prev, images: ['/icon.svg'] }))
                        setImageError(null)
                      }}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-muted text-sm"
                    >
                      Clear
                    </button>
                  </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Key specifications</label>
                <textarea
                  className="w-full p-2 border border-border rounded-lg bg-background text-sm"
                  rows={5}
                  placeholder={'6.3" Display\nA18 Pro\n48MP Camera'}
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground italic">
                  One specification per line. Shown on the product page under “Key Specifications”.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Description</label>
                <textarea
                  className="w-full p-2 border border-border rounded-lg bg-background"
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">HP Verse Admin</h1>
            <p className="text-sm text-muted-foreground">Welcome, {admin?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {[
            { id: 'overview' as const, label: 'Overview' },
            { id: 'products' as const, label: 'Products' },
            { id: 'orders' as const, label: 'Orders' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-semibold text-sm transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-foreground border-foreground'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="bg-card border border-border rounded-lg p-6 space-y-3">
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-serif font-bold text-foreground">{stat.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-foreground mb-6">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 text-foreground font-semibold">{order.id}</td>
                        <td className="py-3 px-4 text-muted-foreground">{order.customerName}</td>
                        <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                        <td className="py-3 px-4 text-foreground font-semibold">{formatINR(order.total)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'Cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">No orders yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 border-b border-border">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Product Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Brand</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Condition</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Price</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Stock</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6 text-foreground font-semibold">{product.name}</td>
                        <td className="py-4 px-6 text-muted-foreground">{product.brand}</td>
                        <td className="py-4 px-6 text-muted-foreground">
                          <span className="px-2 py-1 bg-muted rounded text-[10px] font-bold uppercase tracking-wider">
                            {product.condition}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-foreground font-semibold">{formatINR(product.price)}</td>
                        <td className="py-4 px-6">
                          {Number(product.stockQuantity ?? 0) > 0 ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              {Math.floor(Number(product.stockQuantity ?? 0))} piece(s) left
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-serif font-bold text-foreground mb-6">All Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Items</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-foreground font-semibold">{order.id}</td>
                      <td className="py-3 px-4 text-muted-foreground">{order.customerName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</td>
                      <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                      <td className="py-3 px-4 text-foreground font-semibold">{formatINR(order.total)}</td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className={`px-2 py-1 rounded-full text-xs font-semibold bg-transparent border border-border focus:outline-none ${
                            order.status === 'Completed'
                              ? 'text-green-700 border-green-200 bg-green-50'
                              : order.status === 'Cancelled'
                              ? 'text-red-700 border-red-200 bg-red-50'
                              : 'text-yellow-700 border-yellow-200 bg-yellow-50'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors"
                            title="View order details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {selectedOrder && (
              <div className="mt-6 border border-border rounded-lg p-6 bg-muted/20 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-bold text-foreground">Order Details: {selectedOrder.id}</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-3 py-1 border border-border rounded-lg hover:bg-muted text-sm"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Customer</p>
                    <p className="text-foreground font-semibold">{selectedOrder.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Phone</p>
                    <p className="text-foreground font-semibold">{selectedOrder.phone || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Email</p>
                    <p className="text-foreground font-semibold">{selectedOrder.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="text-foreground font-semibold">{selectedOrder.paymentMethod || 'N/A'}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-muted-foreground">Delivery Address</p>
                    <p className="text-foreground font-semibold">{selectedOrder.address}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Date</p>
                    <p className="text-foreground font-semibold">{selectedOrder.date}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Total</p>
                    <p className="text-foreground font-semibold">{formatINR(selectedOrder.total)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-2">Products in this order</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={`${selectedOrder.id}-${item.product.id}`}
                        className="flex items-center justify-between border border-border rounded-lg p-3 bg-background"
                      >
                        <div>
                          <p className="text-foreground font-semibold">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-foreground font-semibold">{formatINR(item.product.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
