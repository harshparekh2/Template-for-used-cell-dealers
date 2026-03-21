'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">
                Our Story
              </p>
              <h1 className="text-5xl sm:text-6xl font-serif font-bold text-foreground leading-tight">
                Redefining Premium Smartphone Experience
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Since 2018, HP Verse has been dedicated to bringing together the world's finest smartphones with expert guidance and white-glove service.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To democratize access to premium technology by providing expert consultation, transparent pricing, and exceptional service. We believe everyone deserves the freedom to choose the perfect device for their lifestyle.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Our Vision</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To become the world's most trusted premium smartphone destination. A place where technology meets artistry, and where customer experience transcends traditional retail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground">What drives us every day</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Excellence',
                  description: 'We never compromise on quality or service'
                },
                {
                  title: 'Integrity',
                  description: 'Transparent practices and honest guidance'
                },
                {
                  title: 'Innovation',
                  description: 'Always exploring new ways to serve you better'
                },
                {
                  title: 'Community',
                  description: 'Building lasting relationships with our customers'
                }
              ].map((value, index) => (
                <div key={index} className="text-center space-y-3">
                  <h3 className="text-xl font-serif font-bold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 sm:py-24 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">
                Our Team
              </p>
              <h2 className="text-4xl font-serif font-bold text-foreground">
                Meet the Experts
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'Sarah Chen', role: 'Founder & CEO', bio: '15+ years in technology retail' },
                { name: 'Marcus Johnson', role: 'Head of Sales', bio: 'Premium device specialist' },
                { name: 'Elena Rodriguez', role: 'Customer Success', bio: 'Dedicated to your experience' },
                { name: 'James Wilson', role: 'Tech Director', bio: 'Latest gadget enthusiast' }
              ].map((member, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                    <span className="text-muted-foreground text-sm">Photo</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold text-accent uppercase tracking-wider">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 sm:py-24 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <p className="text-5xl font-serif font-bold">6+</p>
                <p className="text-sm opacity-75 uppercase tracking-wider">Years in Business</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-serif font-bold">50k+</p>
                <p className="text-sm opacity-75 uppercase tracking-wider">Satisfied Customers</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-serif font-bold">500+</p>
                <p className="text-sm opacity-75 uppercase tracking-wider">Products Offered</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24 border-t border-border">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-4xl font-serif font-bold text-foreground">
              Ready to Find Your Perfect Device?
            </h2>
            <p className="text-lg text-muted-foreground">
              Connect with one of our experts for personalized recommendations
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
            >
              Book a Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
