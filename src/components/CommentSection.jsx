import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function CommentSection({ confessionId, comments = [], onCommentAdded }) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || submitting) return
    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({ confession_id: confessionId, content: text.trim() })
        .select()
        .single()
      if (error) throw error
      setText('')
      onCommentAdded?.(data)
    } catch (err) {
      console.error('Failed to post comment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-[var(--font-playfair)] text-[var(--color-paper)]">
        💬 Anonymous Comments
      </h3>

      {/* Comments list */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {comments.map((comment, i) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 bg-[var(--color-surface)] rounded-lg"
          >
            <p className="text-sm text-[var(--color-paper)] font-[var(--font-syne)] leading-relaxed">
              {comment.content}
            </p>
            <p className="text-[10px] text-[var(--color-muted)] mt-1.5">
              {new Date(comment.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </motion.div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-[var(--color-muted)] italic">No comments yet. Be the first to say something...</p>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="say something... anonymously"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-[var(--color-card-black)] border border-[var(--color-surface)] rounded-lg text-sm text-[var(--color-paper)] placeholder-[var(--color-muted)] focus:border-[var(--color-gold-dim)] transition-colors font-[var(--font-syne)]"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={submitting || !text.trim()}
          className="px-4 py-2.5 bg-[var(--color-crimson)] text-[var(--color-paper)] text-sm font-semibold rounded-lg hover:bg-[var(--color-crimson-glow)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-[var(--font-syne)]"
        >
          {submitting ? '...' : 'Post'}
        </motion.button>
      </form>
    </div>
  )
}
