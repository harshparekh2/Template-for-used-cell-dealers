'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    alert('Thank you for your message. We will get back to you soon!')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">
                Get in Touch
              </p>
              <h1 className="text-5xl sm:text-6xl font-serif font-bold text-foreground leading-tight">
                We're Here to Help
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? Our expert team is ready to assist you with personalized recommendations and support
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {/* Contact Info Cards */}
              <div className="border border-border rounded-xl bg-muted/20 p-4 sm:p-5">
                <div className="flex gap-3 sm:gap-4">
                  <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif font-bold text-foreground mb-1">Phone</h3>
                    <p className="text-muted-foreground text-sm">+91 98765 43210</p>
                    <p className="text-muted-foreground text-sm">Mon - Sat: 10am - 8pm IST</p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-xl bg-muted/20 p-4 sm:p-5">
                <div className="flex gap-3 sm:gap-4">
                  <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif font-bold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground text-sm">support@hpverse.in</p>
                    <p className="text-muted-foreground text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-xl bg-muted/20 p-4 sm:p-5 sm:col-span-2 lg:col-span-1">
                <div className="flex gap-3 sm:gap-4">
                  <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif font-bold text-foreground mb-1">Location</h3>
                    <p className="text-muted-foreground text-sm">45, Bandra West</p>
                    <p className="text-muted-foreground text-sm">Mumbai, Maharashtra 400050</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent placeholder-muted-foreground"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent placeholder-muted-foreground"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent placeholder-muted-foreground"
                      placeholder="+1 (234) 567-890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="consultation">Book Consultation</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent placeholder-muted-foreground resize-none"
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Business Hours & Info */}
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Business Hours</h2>
                
                <div className="space-y-4 mb-8 border border-border rounded-xl p-4 sm:p-5 bg-muted/20">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div className="space-y-2 w-full">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="font-semibold text-foreground">Monday - Friday</span>
                        <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="font-semibold text-foreground">Saturday</span>
                        <span className="text-muted-foreground">10:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="font-semibold text-foreground">Sunday</span>
                        <span className="text-muted-foreground">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 border border-border rounded-xl p-5 sm:p-6 space-y-4">
                  <h3 className="text-lg font-serif font-bold text-foreground">Schedule a Consultation</h3>
                  <p className="text-muted-foreground text-sm">
                    Our experts are available for personalized 30-minute consultations to help you find the perfect device.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">In-Store Visit</p>
                    <p className="text-sm text-muted-foreground">
                      Visit us at our Manhattan location for a hands-on experience with our premium collection.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Virtual Consultation</p>
                    <p className="text-sm text-muted-foreground">
                      Video call with one of our specialists to discuss options at your convenience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-24 bg-muted/30 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-serif font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: 'Do you offer warranty coverage?',
                  a: 'Yes! All devices come with our 2-year extended warranty as standard, covering manufacturer defects and accidental damage.'
                },
                {
                  q: 'What is your return policy?',
                  a: 'We offer a 30-day money-back guarantee if you\'re not completely satisfied with your purchase.'
                },
                {
                  q: 'Do you offer trade-in programs?',
                  a: 'Absolutely! We accept trade-ins of any smartphone in working condition. Contact us for an instant quote.'
                },
                {
                  q: 'Can I schedule a consultation before purchasing?',
                  a: 'Of course! We encourage consultations. Call us or fill out the form to schedule a time that works for you.'
                }
              ].map((faq, index) => (
                <details
                  key={index}
                  className="group border border-border rounded-lg p-4 cursor-pointer hover:bg-card transition-colors"
                >
                  <summary className="font-semibold text-foreground flex items-center justify-between">
                    {faq.q}
                    <span className="text-accent group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
