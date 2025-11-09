import React from 'react'
import { Link } from 'react-router-dom'
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard
} from 'lucide-react'

const ShortFooter = () => {
  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ]

  const quickLinks = [
    { label: 'Home', href: '/home' },
    { label: 'All Products', href: '/products' },
    { label: 'New Arrivals', href: '/products?filter=new' },
    { label: 'Best Sellers', href: '/products?filter=popular' },
  ]

  const supportLinks = [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Returns & Refunds', href: '/returns' },
  ]

  return (
    <footer className="relative bg-slate-950 text-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_55%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-primary-500 to-purple-600 shadow-lg flex items-center justify-center text-white font-semibold">
                S
              </div>
              <div>
                <p className="text-lg font-semibold">LuxeMart</p>
                <p className="text-xs text-slate-400">Luxury marketplace</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover handpicked watches, premium footwear, and timeless accessories. We curate only the finest
              products with transparent pricing and concierge-level support.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span>support@LuxeMart.com</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-slate-400 space-x-2">
              <MapPin className="h-4 w-4 text-primary-400" />
              <span>451 Market Street, San Francisco, CA</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">Discover</h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col space-y-4 shadow-lg shadow-primary-500/10">
            <div>
              <p className="text-sm font-semibold text-white">Join the insiders club</p>
              <p className="text-xs text-slate-400">
                Stay ahead with exclusive drops, early access, and curated styling tips.
              </p>
            </div>
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault()
              }}
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/70 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-500 to-indigo-600 text-sm font-semibold text-white py-2.5 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-shadow"
              >
                <span>Subscribe</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[11px] text-slate-400">
                We respect your privacy. No spam — just premium updates.
              </p>
            </form>
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-white/10 text-slate-300 hover:text-white hover:border-primary-400 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-300">
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-primary-400" />
            <div>
              <p className="font-semibold text-white">Authenticity guaranteed</p>
              <p className="text-[12px] text-slate-400">Verified brands & certified resellers only</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
            <Truck className="h-5 w-5 text-primary-400" />
            <div>
              <p className="font-semibold text-white">Express delivery</p>
              <p className="text-[12px] text-slate-400">Worldwide shipping with real-time tracking</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
            <CreditCard className="h-5 w-5 text-primary-400" />
            <div>
              <p className="font-semibold text-white">Flexible payment</p>
              <p className="text-[12px] text-slate-400">Installments, crypto, and secure checkout</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center space-x-1">
            <span>© {new Date().getFullYear()} LuxeMart. Crafted with</span>
            <Heart className="h-4 w-4 text-rose-400" />
            <span>for style aficionados.</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default ShortFooter
