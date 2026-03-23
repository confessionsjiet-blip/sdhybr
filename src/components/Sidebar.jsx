import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ConfessionCard from './ConfessionCard'

const SORT_PILLS = ['Newest', 'Hot', 'Trending']

export default function Sidebar({ confessions = [], searchQuery, onSearchChange, activeSort, onSortChange }) {
  const recentConfessions = confessions.slice(0, 5)

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="sticky top-20 space-y-5"
    >
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search confessions..."
          value={searchQuery || ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full px-4 py-2.5 bg-[var(--color-card-black)] border border-[var(--color-surface)] rounded-lg text-sm text-[var(--color-paper)] placeholder-[var(--color-muted)] focus:border-[var(--color-gold-dim)] transition-colors font-[var(--font-syne)]"
        />
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Sort pills */}
      <div className="flex gap-2">
        {SORT_PILLS.map((pill) => (
          <button
            key={pill}
            onClick={() => onSortChange?.(pill.toLowerCase())}
            className={`px-3 py-1 text-xs rounded-full font-[var(--font-syne)] transition-colors ${
              activeSort === pill.toLowerCase()
                ? 'bg-[var(--color-crimson)] text-[var(--color-paper)]'
                : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-paper)]'
            }`}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Recent confessions */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-syne)] font-semibold mb-3">
          Recent
        </h3>
        <div className="space-y-2">
          {recentConfessions.map((c, i) => (
            <ConfessionCard key={c.id} confession={c} index={i} compact />
          ))}
          {recentConfessions.length === 0 && (
            <p className="text-xs text-[var(--color-muted)] italic">No confessions yet...</p>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link to="/post">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-3 py-3 bg-[var(--color-crimson)] text-[var(--color-paper)] font-[var(--font-syne)] font-semibold text-sm rounded-lg hover:bg-[var(--color-crimson-glow)] transition-colors"
        >
          POST A CONFESSION +
        </motion.button>
      </Link>
    </motion.aside>
  )
}
