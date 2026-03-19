'use client'

import { useAdminStore } from '@/store/adminStore'
import { useProductStore, Product } from '@/store/productStore'
import { useOrderStore, Order } from '@/store/orderStore'
import { useRouter } from 'next/navigation'
import { LogOut, Plus, Edit, Trash2, Package, ShoppingCart, Users, TrendingUp, X, Image as ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
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

  // Product Form State
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    brand: '',
    price: 0,
    images: ['/placeholder.jpg'],
    specs: [],
    description: '',
    inStock: true,
    condition: 'Excellent',
    category: 'flagship'
  })

  // Helper for image input
  const [imageUrls, setImageUrls] = useState('/placeholder.jpg')

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
      images: ['/placeholder.jpg'],
      specs: [],
      description: '',
      inStock: true,
      condition: 'Excellent',
      category: 'flagship'
    })
    setImageUrls('/placeholder.jpg')
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData(product)
    setImageUrls(product.images.join('\n'))
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalImages = imageUrls.split('\n').filter(url => url.trim() !== '')
    const submissionData = { ...formData, images: finalImages }
    
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
                  <label className="text-sm font-semibold">Stock Status</label>
                  <div className="flex items-center gap-2 h-10">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={formData.inStock}
                      onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                    />
                    <label htmlFor="inStock" className="text-sm font-semibold">In Stock</label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Product Photos (One URL per line)
                </label>
                <textarea
                  className="w-full p-2 border border-border rounded-lg bg-background font-mono text-xs"
                  rows={4}
                  placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                  value={imageUrls}
                  onChange={e => setImageUrls(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground italic">Add multiple photos to showcase phone condition from different angles.</p>
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
            <h1 className="text-2xl font-serif font-bold text-foreground">LuxCell Admin</h1>
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
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.inStock
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
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
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
          </div>
        )}
      </main>
    </div>
  )
}
