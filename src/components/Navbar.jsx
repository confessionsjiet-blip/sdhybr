import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = ['Relationships', 'Academics', 'Hostel Life', 'Faculty', 'Random']
const VIBES = [
  { label: '😭 Rant', value: 'rant' },
  { label: '🌶️ Spicy', value: 'spicy' },
  { label: '💀 Cursed', value: 'cursed' },
  { label: '🥺 Vulnerable', value: 'vulnerable' },
]
const SORT_OPTIONS = [
  { label: '🔥 Most Upvotes', value: 'upvotes' },
  { label: '🫂 Most Me Too\'s', value: 'metoo' },
  { label: '🕐 Newest', value: 'newest' },
  { label: '⏳ Expiring Soon', value: 'expiring' },
]

function Dropdown({ label, items, onSelect, isVibe }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 text-sm text-[var(--color-paper)] hover:text-[var(--color-gold)] transition-colors flex items-center gap-1.5 font-[var(--font-syne)]"
      >
        {label}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 mt-2 min-w-[200px] bg-[var(--color-surface)] border border-[var(--color-gold-dim)] rounded-lg shadow-2xl z-50 overflow-hidden origin-top"
          >
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => { onSelect?.(item.value || item); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors ${
                  isVibe ? 'font-[var(--font-caveat)] text-base' : 'font-[var(--font-syne)]'
                } text-[var(--color-paper)]`}
              >
                {item.label || item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar({ onCategoryChange, onVibeChange, onSortChange }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-nav-black)] border-b border-[var(--color-gold-dim)]/30">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-3">
          {!isHome && (
            <motion.button
              whileHover={{ x: -3 }}
              onClick={() => navigate(-1)}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-crimson-glow)] transition-colors flex items-center gap-1"
            >
              <span>←</span> Back
            </motion.button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-[var(--font-playfair)] text-[var(--color-paper)] tracking-tight">
              JIET <span className="text-[var(--color-crimson)]">Confessions</span>
            </h1>
            <div className="w-8 h-[2px] bg-[var(--color-crimson)] rounded-full hidden sm:block" />
          </Link>
        </div>

        {/* Center: Dropdowns (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          <Dropdown label="Categories" items={CATEGORIES} onSelect={onCategoryChange} />
          <Dropdown label="Vibes" items={VIBES} onSelect={onVibeChange} isVibe />
          <Dropdown label="Sort By" items={SORT_OPTIONS} onSelect={onSortChange} />
        </div>

        {/* Right: Confess CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link to="/post">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 bg-[var(--color-crimson)] border border-[var(--color-gold-dim)] text-[var(--color-paper)] text-sm font-semibold rounded-full hover:bg-[var(--color-crimson-glow)] transition-colors font-[var(--font-syne)]"
            >
              ✍️ Confess
            </motion.button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[var(--color-paper)] p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-[var(--color-nav-black)] border-t border-[var(--color-gold-dim)]/20 px-4 pb-4"
          >
            <div className="flex flex-col gap-2 pt-3">
              <Dropdown label="Categories" items={CATEGORIES} onSelect={(v) => { onCategoryChange?.(v); setMobileMenuOpen(false) }} />
              <Dropdown label="Vibes" items={VIBES} onSelect={(v) => { onVibeChange?.(v); setMobileMenuOpen(false) }} isVibe />
              <Dropdown label="Sort By" items={SORT_OPTIONS} onSelect={(v) => { onSortChange?.(v); setMobileMenuOpen(false) }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
