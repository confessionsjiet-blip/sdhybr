import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const VIBE_STYLES = {
  rant: { emoji: '😭', bg: 'rgba(192, 57, 43, 0.15)', color: '#E74C3C', border: '#C0392B' },
  spicy: { emoji: '🌶️', bg: 'rgba(192, 57, 43, 0.15)', color: '#E74C3C', border: '#C0392B' },
  cursed: { emoji: '💀', bg: 'rgba(90, 85, 80, 0.2)', color: '#888', border: '#5A5550' },
  vulnerable: { emoji: '🥺', bg: 'rgba(201, 168, 76, 0.12)', color: '#C9A84C', border: '#C9A84C' },
}

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function expiryText(expiresAt) {
  if (!expiresAt) return null
  const now = new Date()
  const exp = new Date(expiresAt)
  const hoursLeft = Math.max(0, Math.floor((exp - now) / (1000 * 60 * 60)))
  if (hoursLeft < 1) return 'expiring soon'
  if (hoursLeft < 24) return `${hoursLeft}h left`
  return `${Math.floor(hoursLeft / 24)}d left`
}

export default function ConfessionCard({ confession, index = 0, onUpvote, onMeToo, onReport, compact = false }) {
  const vibe = VIBE_STYLES[confession.vibe_tag] || VIBE_STYLES.rant
  const expiry = expiryText(confession.expires_at)

  if (compact) {
    return (
      <Link to={`/confession/${confession.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="p-3 bg-[var(--color-card-black)] rounded-lg card-paper hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
        >
          <p className="text-xs text-[var(--color-paper)] line-clamp-2 font-[var(--font-syne)] leading-relaxed">{confession.content}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--color-muted)]">
            <span>👍 {confession.upvote_count || 0}</span>
            <span>{timeAgo(confession.created_at)}</span>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link to={`/confession/${confession.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="relative p-5 bg-[var(--color-card-black)] rounded-xl card-paper cursor-pointer group"
      >
        {/* Vibe tag sticker */}
        {confession.vibe_tag && (
          <div
            className="absolute -top-2 -right-2 px-2.5 py-1 rounded-lg text-xs font-[var(--font-caveat)] font-bold rotate-2 animate-wobble z-10"
            style={{ background: vibe.bg, color: vibe.color, border: `1px solid ${vibe.border}40` }}
          >
            {vibe.emoji} {confession.vibe_tag}
          </div>
        )}

        {/* Category pill */}
        {confession.category && (
          <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-[var(--font-syne)] text-[var(--color-muted)] bg-[var(--color-surface)] rounded-full mb-3">
            {confession.category}
          </span>
        )}

        {/* Confession text */}
        <p className="text-sm text-[var(--color-paper)] font-[var(--font-syne)] leading-relaxed line-clamp-4 mb-4">
          {confession.content}
        </p>

        {/* Bottom row */}
        <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] flex-wrap">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUpvote?.(confession.id) }}
            className="flex items-center gap-1 hover:text-[var(--color-gold)] transition-colors"
          >
            👍 {confession.upvote_count || 0}
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMeToo?.(confession.id) }}
            className="flex items-center gap-1 hover:text-[var(--color-crimson-glow)] transition-colors"
          >
            🫂 {confession.me_too_count || 0}
          </button>
          <span className="flex items-center gap-1">💬 {confession.comment_count || 0}</span>
          {expiry && (
            <span className="px-1.5 py-0.5 bg-[var(--color-surface)] rounded text-[10px] text-[var(--color-gold)]">
              ⏳ {expiry}
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onReport?.(confession.id) }}
            className="ml-auto hover:text-[var(--color-crimson-glow)] transition-colors"
          >
            🚩
          </button>
          <span className="text-[10px]">{timeAgo(confession.created_at)}</span>
        </div>

        {/* Hover gold border */}
        <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[var(--color-gold-dim)]/20 transition-colors pointer-events-none" />
      </motion.div>
    </Link>
  )
}
