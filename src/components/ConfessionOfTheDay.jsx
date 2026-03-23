import { motion } from 'framer-motion'

export default function ConfessionOfTheDay({ confession }) {
  if (!confession) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full p-6 bg-[var(--color-card-black)] rounded-xl border-l-4 animate-pulse-crimson card-paper overflow-hidden"
    >
      {/* Crown + label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">👑</span>
        <span className="text-[10px] uppercase tracking-[0.2em] font-[var(--font-syne)] font-semibold text-[var(--color-gold)]">
          Confession of the Day
        </span>
      </div>

      {/* Category */}
      {confession.category && (
        <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-[var(--font-syne)] text-[var(--color-muted)] bg-[var(--color-surface)] rounded-full mb-3">
          {confession.category}
        </span>
      )}

      {/* Confession text */}
      <p className="text-base text-[var(--color-paper)] font-[var(--font-syne)] leading-relaxed mb-5">
        {confession.content}
      </p>

      {/* Counts */}
      <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
        <span className="flex items-center gap-1">👍 {confession.upvote_count || 0}</span>
        <span className="flex items-center gap-1">🫂 {confession.me_too_count || 0}</span>
        <span className="flex items-center gap-1">💬 {confession.comment_count || 0}</span>
      </div>

      {/* Decorative glow */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[var(--color-crimson)] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  )
}
