import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function ConfessionChain({ parentId, chains = [], onChainAdded }) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || submitting) return
    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('confessions')
        .insert({
          content: text.trim(),
          parent_id: parentId,
          category: 'Random',
          vibe_tag: 'vulnerable',
        })
        .select()
        .single()
      if (error) throw error
      setText('')
      onChainAdded?.(data)
    } catch (err) {
      console.error('Failed to post chain confession:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-[var(--font-playfair)] italic text-[var(--color-paper)]">
        🔗 Confess something related
      </h3>

      {/* Chain thread */}
      {chains.length > 0 && (
        <div className="relative pl-6 space-y-3">
          {/* Gold connector line */}
          <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--color-gold-dim)] to-transparent rounded-full" />

          {chains.map((chain, i) => (
            <motion.div
              key={chain.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-4 bg-[var(--color-surface)] rounded-lg border-l-2 border-[var(--color-gold-dim)]/40"
            >
              {chain.vibe_tag && (
                <span className="inline-block px-2 py-0.5 text-xs font-[var(--font-caveat)] text-[var(--color-gold)] bg-[var(--color-gold)]/10 rounded mb-2">
                  {chain.vibe_tag}
                </span>
              )}
              <p className="text-sm text-[var(--color-paper)] font-[var(--font-syne)] leading-relaxed">
                {chain.content}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--color-muted)]">
                <span>👍 {chain.upvote_count || 0}</span>
                <span>🫂 {chain.me_too_count || 0}</span>
                <span>{new Date(chain.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Chain confession input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          placeholder="this reminds me of..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-[var(--color-card-black)] border border-[var(--color-surface)] rounded-lg text-sm text-[var(--color-paper)] placeholder-[var(--color-muted)] focus:border-[var(--color-gold-dim)] transition-colors resize-none font-[var(--font-syne)]"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={submitting || !text.trim()}
          className="px-5 py-2 bg-[var(--color-surface)] border border-[var(--color-gold-dim)]/30 text-[var(--color-paper)] text-sm rounded-lg hover:border-[var(--color-gold-dim)] transition-colors disabled:opacity-50 font-[var(--font-syne)]"
        >
          {submitting ? 'Posting...' : 'Chain Confess →'}
        </motion.button>
      </form>
    </div>
  )
}
