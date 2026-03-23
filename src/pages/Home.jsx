import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import ConfessionOfTheDay from '../components/ConfessionOfTheDay'
import ConfessionCard from '../components/ConfessionCard'
import Sidebar from '../components/Sidebar'
import PageTransition from '../components/PageTransition'

export default function Home() {
  const [confessions, setConfessions] = useState([])
  const [cotd, setCotd] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSort, setActiveSort] = useState('newest')
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeVibe, setActiveVibe] = useState(null)

  const fetchConfessions = useCallback(async () => {
    let query = supabase
      .from('confessions')
      .select('*')
      .is('parent_id', null)

    // Filter expired
    query = query.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())

    // Category filter
    if (activeCategory) {
      query = query.eq('category', activeCategory)
    }

    // Vibe filter
    if (activeVibe) {
      query = query.eq('vibe_tag', activeVibe)
    }

    // Search
    if (searchQuery.trim()) {
      query = query.ilike('content', `%${searchQuery.trim()}%`)
    }

    // Sorting
    switch (activeSort) {
      case 'hot':
      case 'upvotes':
      case 'trending':
        query = query.order('upvote_count', { ascending: false })
        break
      case 'metoo':
        query = query.order('me_too_count', { ascending: false })
        break
      case 'expiring':
        query = query.not('expires_at', 'is', null).order('expires_at', { ascending: true })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
    }

    query = query.limit(50)

    const { data, error } = await query
    if (error) {
      console.error('Error fetching confessions:', error)
    } else {
      setConfessions(data || [])
    }
    setLoading(false)
  }, [activeSort, activeCategory, activeVibe, searchQuery])

  const fetchCotd = async () => {
    const { data } = await supabase
      .from('confession_of_the_day')
      .select('*')
      .single()
    setCotd(data)
  }

  useEffect(() => {
    fetchConfessions()
    fetchCotd()
  }, [fetchConfessions])

  const handleUpvote = async (id) => {
    setConfessions(prev => prev.map(c => c.id === id ? { ...c, upvote_count: (c.upvote_count || 0) + 1 } : c))
    await supabase.rpc('increment_upvote', { confession_id: id })
  }

  const handleMeToo = async (id) => {
    setConfessions(prev => prev.map(c => c.id === id ? { ...c, me_too_count: (c.me_too_count || 0) + 1 } : c))
    await supabase.rpc('increment_me_too', { confession_id: id })
  }

  const handleReport = async (id) => {
    const reason = prompt('Why are you reporting this confession?')
    if (!reason) return
    await supabase.from('reports').insert({ confession_id: id, reason })
  }

  return (
    <div className="min-h-screen bg-[var(--color-ink-black)]">
      <Navbar
        onCategoryChange={setActiveCategory}
        onVibeChange={setActiveVibe}
        onSortChange={setActiveSort}
      />
      <PageTransition>
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-5xl font-black font-[var(--font-playfair)] text-[var(--color-paper)] leading-tight tracking-tight">
              SPILL YOUR HEART OUT<span className="text-[var(--color-crimson)]">.</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base italic font-[var(--font-syne)] text-[var(--color-muted)]">
              anonymous. unfiltered. yours. we won't judge, we promise.
            </p>
          </motion.div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main area */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Confession of the Day */}
              <ConfessionOfTheDay confession={cotd} />

              {/* Search + Sort pills (mobile/main) */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="relative flex-1 w-full lg:hidden">
                  <input
                    type="text"
                    placeholder="Search confessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--color-card-black)] border border-[var(--color-surface)] rounded-lg text-sm text-[var(--color-paper)] placeholder-[var(--color-muted)] focus:border-[var(--color-gold-dim)] transition-colors font-[var(--font-syne)]"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['newest', 'hot', 'trending'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSort(s)}
                      className={`px-3 py-1 text-xs rounded-full font-[var(--font-syne)] capitalize transition-colors ${
                        activeSort === s
                          ? 'bg-[var(--color-crimson)] text-[var(--color-paper)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-paper)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  {activeCategory && (
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="px-3 py-1 text-xs rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] font-[var(--font-syne)]"
                    >
                      {activeCategory} ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Confession grid */}
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-[var(--color-crimson)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : confessions.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-[var(--color-muted)] font-[var(--font-syne)] text-lg">No confessions found.</p>
                  <p className="text-[var(--color-muted)] font-[var(--font-syne)] text-sm mt-1">Be the first to spill...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {confessions.map((c, i) => (
                    <ConfessionCard
                      key={c.id}
                      confession={c}
                      index={i}
                      onUpvote={handleUpvote}
                      onMeToo={handleMeToo}
                      onReport={handleReport}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar (desktop) */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <Sidebar
                confessions={confessions}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeSort={activeSort}
                onSortChange={setActiveSort}
              />
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  )
}
