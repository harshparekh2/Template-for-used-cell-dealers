'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import type { CartItem } from '@/store/cartStore'
import { useOrderStore } from '@/store/orderStore'
import { useProductStore } from '@/store/productStore'
import { useState } from 'react'
import Link from 'next/link'
import { Check, Lock, Smartphone, CreditCard, Wallet, Truck } from 'lucide-react'
import { formatINR } from '@/lib/utils'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 
  'Ladakh', 'Puducherry'
]

export default function CheckoutPage() {
  const { items, getTotal, clearCart, syncItemsWithCatalog } = useCartStore()
  const { addOrder } = useOrderStore()
  const { products, loadProducts, updateProduct } = useProductStore()
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderItemsSnapshot, setOrderItemsSnapshot] = useState<CartItem[]>([])
  const [orderTotalSnapshot, setOrderTotalSnapshot] = useState<number>(0)
  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    zip: '',
    country: 'India',
    // Payment
    paymentMethod: 'UPI' as 'UPI' | 'COD' | 'NetBanking'
  })
  const hasUnavailableItems = items.some((item) => {
    const latest = products.find((p) => p.id === item.product.id)
    const qty = Math.max(0, Math.floor(Number(latest?.stockQuantity ?? (latest?.inStock ? 1 : 0))))
    return qty <= 0 || item.quantity > qty
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOrderError(null)
    setIsPlacingOrder(true)
    try {
      const created = await addOrder({
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zip}, ${formData.country}`,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        paymentMethod: formData.paymentMethod,
        items,
        // server recomputes total; kept to satisfy type
        total: getTotal() + Math.round(getTotal() * 0.12),
      })

      void created
      setOrderItemsSnapshot([...items])
      setOrderTotalSnapshot(getTotal() + Math.round(getTotal() * 0.12))
      await loadProducts()
      clearCart()
      setStep('confirmation')
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Could not complete order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const handleOrderConfirm = () => {
    // Redirect to home
    window.location.href = '/'
  }

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-serif font-bold text-foreground">Cart is Empty</h1>
            <p className="text-muted-foreground">Please add items before checking out</p>
            <Link
              href="/collection"
              className="inline-block px-6 py-3 bg-foreground text-background rounded-lg font-semibold hover:bg-foreground/90 transition-colors"
            >
              Continue Shopping
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout */}
            <div className="lg:col-span-2">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
                  {[
                    { label: 'Shipping', id: 'shipping' as const },
                    { label: 'Payment', id: 'payment' as const },
                    { label: 'Confirmation', id: 'confirmation' as const }
                  ].map((s, index) => (
                    <div key={s.id} className="flex items-center gap-2 sm:gap-4 min-w-[120px] flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                          step === s.id || (s.id === 'confirmation' && step === 'confirmation')
                            ? 'bg-foreground text-background'
                            : s.id === 'shipping' || s.id === 'payment'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {(s.id === 'shipping' || s.id === 'payment') && (step === s.id) ? index + 1 : (step !== 'shipping' && step !== 'payment') ? <Check className="w-5 h-5" /> : index + 1}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground">{s.label}</span>
                      {index < 2 && <div className="flex-1 h-1 bg-border" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Form */}
              {(step === 'shipping') && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  {hasUnavailableItems && (
                    <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm font-semibold">
                      Some products in your cart are out of stock or exceed available quantity. Please update your cart before checkout.
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Shipping Information</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="sm:col-span-2 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="sm:col-span-2 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>

                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    >
                      {INDIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="zip"
                      placeholder="Pincode"
                      value={formData.zip}
                      onChange={handleChange}
                      className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                      pattern="[0-9]{6}"
                    />
                    <input
                      type="text"
                      name="country"
                      value="India"
                      disabled
                      className="px-4 py-3 border border-border rounded-lg bg-muted text-muted-foreground"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={hasUnavailableItems}
                    className="w-full px-6 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {/* Payment Form */}
              {(step === 'payment') && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Payment Method</h2>
                  </div>

                  {orderError && (
                    <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm font-semibold">
                      {orderError}
                    </div>
                  )}

                  <div className="space-y-4">
                    {[
                      { id: 'UPI', label: 'UPI (GPay, PhonePe, Paytm)', icon: Smartphone },
                      { id: 'COD', label: 'Cash on Delivery', icon: Truck },
                      { id: 'NetBanking', label: 'Net Banking', icon: Wallet }
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === method.id
                            ? 'border-accent bg-accent/5'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="w-4 h-4 text-accent focus:ring-accent"
                        />
                        <method.icon className="w-6 h-6 text-foreground" />
                        <span className="font-semibold text-foreground">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {formData.paymentMethod === 'UPI' && (
                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <p className="text-sm font-semibold text-foreground">UPI Instructions:</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        After clicking "Complete Order", you will be shown a QR code to scan or you can enter your VPA to pay securely via any UPI app.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    All transactions are secured and encrypted for the Indian market
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="flex-1 px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={hasUnavailableItems || isPlacingOrder}
                      className="flex-1 px-6 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-60 disabled:pointer-events-none"
                    >
                      {isPlacingOrder ? 'Placing order…' : 'Complete Order'}
                    </button>
                  </div>
                </form>
              )}

              {/* Confirmation */}
              {(step === 'confirmation') && (
                <div className="text-center space-y-6 py-12">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                      Order Confirmed!
                    </h2>
                    <p className="text-muted-foreground">
                      Thank you for your purchase. You'll receive a confirmation email shortly.
                    </p>
                  </div>
                  <div className="bg-muted/30 border border-border rounded-lg p-6 text-left space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="text-lg font-semibold text-foreground">#LUX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="text-lg font-semibold text-foreground">
                        {orderItemsSnapshot.length} item
                        {orderItemsSnapshot.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-serif font-bold text-foreground">
                        {formatINR(orderTotalSnapshot)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleOrderConfirm}
                    className="px-8 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
                  >
                    Return to Home
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-muted/30 border border-border rounded-lg p-4 sm:p-6 sticky top-24 space-y-6">
                <h2 className="text-xl font-serif font-bold text-foreground">Order Summary</h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {orderItemsSnapshot.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm pb-3 border-b border-border">
                      <div>
                        <p className="font-semibold text-foreground truncate">{item.product.name}</p>
                        <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-foreground whitespace-nowrap ml-2">
                        {formatINR(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-semibold">
                        {formatINR(
                          orderItemsSnapshot.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
                        )}
                      </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (12%)</span>
                    <span className="text-foreground font-semibold">
                        {formatINR(
                          Math.round(
                            orderItemsSnapshot.reduce((sum, i) => sum + i.product.price * i.quantity, 0) * 0.12
                          )
                        )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-2xl font-serif font-bold text-foreground">
                      {formatINR(orderTotalSnapshot)}
                  </span>
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
