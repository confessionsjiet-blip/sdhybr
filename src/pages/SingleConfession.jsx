import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import CommentSection from '../components/CommentSection'
import ConfessionChain from '../components/ConfessionChain'
import PageTransition from '../components/PageTransition'

const VIBE_STYLES = {
  rant: { emoji: '😭', color: '#E74C3C' },
  spicy: { emoji: '🌶️', color: '#E74C3C' },
  cursed: { emoji: '💀', color: '#888' },
  vulnerable: { emoji: '🥺', color: '#C9A84C' },
}

export default function SingleConfession() {
  const { id } = useParams()
  const [confession, setConfession] = useState(null)
  const [comments, setComments] = useState([])
  const [chains, setChains] = useState([])
  const [loading, setLoading] = useState(true)
  const [upvoteStamped, setUpvoteStamped] = useState(false)
  const [meTooStamped, setMeTooStamped] = useState(false)

  useEffect(() => {
    fetchConfession()
    fetchComments()
    fetchChains()
  }, [id])

  const fetchConfession = async () => {
    const { data, error } = await supabase.from('confessions').select('*').eq('id', id).single()
    if (!error) setConfession(data)
    setLoading(false)
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('confession_id', id)
      .order('created_at', { ascending: true })
    setComments(data || [])
  }

  const fetchChains = async () => {
    const { data } = await supabase
      .from('confessions')
      .select('*')
      .eq('parent_id', id)
      .order('created_at', { ascending: true })
    setChains(data || [])
  }

  const handleUpvote = async () => {
    setConfession(prev => ({ ...prev, upvote_count: (prev.upvote_count || 0) + 1 }))
    setUpvoteStamped(true)
    setTimeout(() => setUpvoteStamped(false), 500)
    await supabase.rpc('increment_upvote', { confession_id: id })
  }

  const handleMeToo = async () => {
    setConfession(prev => ({ ...prev, me_too_count: (prev.me_too_count || 0) + 1 }))
    setMeTooStamped(true)
    setTimeout(() => setMeTooStamped(false), 500)
    await supabase.rpc('increment_me_too', { confession_id: id })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-ink-black)]">
        <Navbar />
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--color-crimson)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!confession) {
    return (
      <div className="min-h-screen bg-[var(--color-ink-black)]">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-[var(--color-muted)] text-lg font-[var(--font-syne)]">Confession not found.</p>
        </div>
      </div>
    )
  }

  const vibe = VIBE_STYLES[confession.vibe_tag]

  return (
    <div className="min-h-screen bg-[var(--color-ink-black)]">
      <Navbar />
      <PageTransition>
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          {/* Full confession card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 sm:p-8 bg-[var(--color-card-black)] rounded-xl border-l-4 border-[var(--color-crimson)] card-paper"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {confession.category && (
                  <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-[var(--font-syne)] text-[var(--color-muted)] bg-[var(--color-surface)] rounded-full">
                    {confession.category}
                  </span>
                )}
                <span className="text-[10px] text-[var(--color-muted)]">
                  {new Date(confession.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              {vibe && (
                <span
                  className="px-3 py-1 text-sm font-[var(--font-caveat)] font-bold rounded-lg rotate-2"
                  style={{ color: vibe.color, background: `${vibe.color}15` }}
                >
                  {vibe.emoji} {confession.vibe_tag}
                </span>
              )}
            </div>

            <p className="text-base sm:text-lg text-[var(--color-paper)] font-[var(--font-syne)] leading-relaxed">
              {confession.content}
            </p>
          </motion.div>

          {/* Upvote + Me Too buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleUpvote}
              className={`flex-1 py-4 bg-[var(--color-card-black)] rounded-xl text-center card-paper hover:bg-[var(--color-surface-hover)] transition-colors ${
                upvoteStamped ? 'animate-ink-stamp' : ''
              }`}
            >
              <span className="text-2xl block mb-1">👍</span>
              <span className="text-lg font-bold text-[var(--color-gold)] font-[var(--font-syne)]">
                {confession.upvote_count || 0}
              </span>
              <span className="text-[10px] text-[var(--color-muted)] block uppercase tracking-wider font-[var(--font-syne)]">
                Upvote
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMeToo}
              className={`flex-1 py-4 bg-[var(--color-card-black)] rounded-xl text-center card-paper hover:bg-[var(--color-surface-hover)] transition-colors ${
                meTooStamped ? 'animate-ink-stamp' : ''
              }`}
            >
              <span className="text-2xl block mb-1">🫂</span>
              <span className="text-lg font-bold text-[var(--color-crimson-glow)] font-[var(--font-syne)]">
                {confession.me_too_count || 0}
              </span>
              <span className="text-[10px] text-[var(--color-muted)] block uppercase tracking-wider font-[var(--font-syne)]">
                Me Too
              </span>
            </motion.button>
          </div>

          {/* Confession Chain */}
          <div className="p-6 bg-[var(--color-card-black)] rounded-xl card-paper">
            <ConfessionChain
              parentId={id}
              chains={chains}
              onChainAdded={(newChain) => setChains(prev => [...prev, newChain])}
            />
          </div>

          {/* Comments */}
          <div className="p-6 bg-[var(--color-card-black)] rounded-xl card-paper">
            <CommentSection
              confessionId={id}
              comments={comments}
              onCommentAdded={(newComment) => setComments(prev => [...prev, newComment])}
            />
          </div>
        </main>
      </PageTransition>
    </div>
  )
}
