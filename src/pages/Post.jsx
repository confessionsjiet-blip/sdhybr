import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'

const CATEGORIES = ['Relationships', 'Academics', 'Hostel Life', 'Faculty', 'Random']
const VIBES = [
  { label: '😭 Rant', value: 'rant', emoji: '😭' },
  { label: '🌶️ Spicy', value: 'spicy', emoji: '🌶️' },
  { label: '💀 Cursed', value: 'cursed', emoji: '💀' },
  { label: '🥺 Vulnerable', value: 'vulnerable', emoji: '🥺' },
]
const EXPIRY_OPTIONS = [
  { label: 'Never', value: null },
  { label: '24 hrs', value: 24 },
  { label: '3 days', value: 72 },
  { label: '7 days', value: 168 },
]

export default function Post() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [vibe, setVibe] = useState('')
  const [expiryHours, setExpiryHours] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [stamped, setStamped] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || !category || submitting) return

    setSubmitting(true)
    setStamped(true)

    const confessionData = {
      content: content.trim(),
      category,
      vibe_tag: vibe || null,
      expires_at: expiryHours
        ? new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString()
        : null,
    }

    try {
      const { error } = await supabase.from('confessions').insert(confessionData)
      if (error) throw error
      setTimeout(() => navigate('/'), 600)
    } catch (err) {
      console.error('Failed to post confession:', err)
      setStamped(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-ink-black)]">
      <Navbar />
      <PageTransition>
        <main className="max-w-2xl mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-black font-[var(--font-playfair)] text-[var(--color-paper)] text-center tracking-tight mb-2">
              DROP YOUR CONFESSION
            </h2>
            <p className="text-center text-sm text-[var(--color-muted)] font-[var(--font-syne)] italic mb-10">
              your secret is safe with us. probably.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Textarea */}
              <div>
                <textarea
                  placeholder="what's on your chest? no one will know it's you..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  maxLength={2000}
                  className="w-full px-5 py-4 bg-[var(--color-card-black)] border border-[var(--color-surface)] rounded-xl text-base text-[var(--color-paper)] placeholder-[var(--color-muted)] focus:border-[var(--color-gold-dim)] transition-colors resize-none font-[var(--font-syne)] leading-relaxed"
                />
                <p className="text-right text-[10px] text-[var(--color-muted)] mt-1">{content.length} / 2000</p>
              </div>

              {/* Category selector */}
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-syne)] font-semibold mb-3 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 text-sm rounded-full font-[var(--font-syne)] transition-colors ${
                        category === cat
                          ? 'bg-[var(--color-crimson)] text-[var(--color-paper)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-paper)] hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Vibe tag selector */}
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-syne)] font-semibold mb-3 block">
                  Vibe Tag <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {VIBES.map((v) => (
                    <motion.button
                      key={v.value}
                      type="button"
                      whileHover={{ scale: 1.08, rotate: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setVibe(vibe === v.value ? '' : v.value)}
                      className={`relative px-5 py-2.5 text-lg font-[var(--font-caveat)] font-bold rounded-xl transition-colors ${
                        vibe === v.value
                          ? 'bg-[var(--color-crimson)]/20 text-[var(--color-paper)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-paper)]'
                      }`}
                    >
                      {v.emoji} {v.value}
                      {vibe === v.value && (
                        <motion.div
                          layoutId="vibe-underline"
                          className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[var(--color-crimson)] rounded-full"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Expiry selector */}
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--color-muted)] font-[var(--font-syne)] font-semibold mb-3 block">
                  Auto-Delete Timer <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXPIRY_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setExpiryHours(opt.value)}
                      className={`px-4 py-2 text-sm rounded-full font-[var(--font-syne)] transition-colors ${
                        expiryHours === opt.value
                          ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)] border border-[var(--color-gold-dim)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-paper)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting || !content.trim() || !category}
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.95 } : {}}
                className={`w-full py-4 bg-[var(--color-crimson)] text-[var(--color-paper)] text-xl font-bold font-[var(--font-playfair)] rounded-xl hover:bg-[var(--color-crimson-glow)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  stamped ? 'animate-ink-stamp' : ''
                }`}
              >
                {submitting ? 'CONFESSING...' : 'CONFESS'}
              </motion.button>
            </form>
          </motion.div>
        </main>
      </PageTransition>
    </div>
  )
}
