'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">LuxCell</h3>
            <p className="text-sm opacity-75">
              Premium smartphone dealership with white-glove service
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/collection" className="opacity-75 hover:opacity-100 transition-opacity">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/about" className="opacity-75 hover:opacity-100 transition-opacity">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="opacity-75 hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@luxcell.in" className="opacity-75 hover:opacity-100 transition-opacity">
                  support@luxcell.in
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="opacity-75 hover:opacity-100 transition-opacity">
                  +91 98765 43210
                </a>
              </li>
              <li className="opacity-75">Mon - Sat: 10am - 8pm IST</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm opacity-75 mb-3">Subscribe for exclusive offers</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 bg-background text-foreground border border-border rounded text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <p className="text-center text-sm opacity-75">
            &copy; {new Date().getFullYear()} LuxCell. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
