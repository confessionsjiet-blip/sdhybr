import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'

const TABS = ['all', 'reported']

export default function Admin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [confessions, setConfessions] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    const { data: confData } = await supabase
      .from('confessions')
      .select('*')
      .order('created_at', { ascending: false })
    setConfessions(confData || [])

    const { data: reportData } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })

    // Fetch confession content for each report
    if (reportData && reportData.length > 0) {
      const confIds = [...new Set(reportData.map(r => r.confession_id))]
      const { data: repConfessions } = await supabase
        .from('confessions')
        .select('id, content, category')
        .in('id', confIds)
      const confMap = Object.fromEntries((repConfessions || []).map(c => [c.id, c]))
      setReports(reportData.map(r => ({ ...r, confession: confMap[r.confession_id] })))
    } else {
      setReports([])
    }

    setLoading(false)
  }

  const handleDelete = async (confessionId) => {
    if (!window.confirm('Delete this confession? This will also remove its comments and reports.')) return
    await supabase.from('confessions').delete().eq('id', confessionId)
    setConfessions(prev => prev.filter(c => c.id !== confessionId))
    setReports(prev => prev.filter(r => r.confession_id !== confessionId))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[var(--color-ink-black)]">
      <Navbar />
      <PageTransition>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold font-[var(--font-playfair)] text-[var(--color-paper)]">
                Admin Dashboard
              </h2>
              <p className="text-sm text-[var(--color-muted)] font-[var(--font-syne)]">Manage confessions and reports</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 bg-[var(--color-surface)] text-[var(--color-muted)] text-sm rounded-lg hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-paper)] transition-colors font-[var(--font-syne)]"
            >
              Logout
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-[var(--font-syne)] capitalize rounded-lg transition-colors ${
                  tab === t
                    ? 'bg-[var(--color-crimson)] text-[var(--color-paper)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-paper)]'
                }`}
              >
                {t === 'all' ? `All Confessions (${confessions.length})` : `Reported (${reports.length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-[var(--color-crimson)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {tab === 'all' ? (
                <motion.div
                  key="all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {confessions.length === 0 ? (
                    <p className="text-center text-[var(--color-muted)] py-8">No confessions yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[var(--color-surface)]">
                            <th className="text-left py-3 px-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-[var(--font-syne)]">Content</th>
                            <th className="text-left py-3 px-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-[var(--font-syne)]">Category</th>
                            <th className="text-left py-3 px-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-[var(--font-syne)]">Vibe</th>
                            <th className="text-left py-3 px-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-[var(--font-syne)]">👍</th>
                            <th className="text-left py-3 px-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-[var(--font-syne)]">Date</th>
                            <th className="py-3 px-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {confessions.map((c) => (
                            <motion.tr
                              key={c.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="border-b border-[var(--color-surface)]/50 hover:bg-[var(--color-surface-hover)] transition-colors"
                            >
                              <td className="py-3 px-2 text-[var(--color-paper)] font-[var(--font-syne)] max-w-xs truncate">{c.content}</td>
                              <td className="py-3 px-2 text-[var(--color-muted)]">{c.category}</td>
                              <td className="py-3 px-2 text-[var(--color-muted)] font-[var(--font-caveat)]">{c.vibe_tag || '-'}</td>
                              <td className="py-3 px-2 text-[var(--color-gold)]">{c.upvote_count || 0}</td>
                              <td className="py-3 px-2 text-[var(--color-muted)] text-xs">
                                {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </td>
                              <td className="py-3 px-2">
                                <button
                                  onClick={() => handleDelete(c.id)}
                                  className="px-3 py-1 text-xs bg-[var(--color-crimson)]/10 text-[var(--color-crimson-glow)] rounded hover:bg-[var(--color-crimson)]/20 transition-colors font-[var(--font-syne)]"
                                >
                                  Delete
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="reported"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {reports.length === 0 ? (
                    <p className="text-center text-[var(--color-muted)] py-8">No reports yet.</p>
                  ) : (
                    reports.map((r) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-[var(--color-card-black)] rounded-lg border border-[var(--color-crimson)]/20"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[var(--color-crimson-glow)] font-[var(--font-syne)] uppercase tracking-wider mb-1">
                              🚩 Report Reason
                            </p>
                            <p className="text-sm text-[var(--color-paper)] font-[var(--font-syne)] mb-3">{r.reason}</p>
                            {r.confession && (
                              <>
                                <p className="text-xs text-[var(--color-muted)] font-[var(--font-syne)] uppercase tracking-wider mb-1">
                                  Confession Content
                                </p>
                                <p className="text-sm text-[var(--color-muted)] font-[var(--font-syne)] line-clamp-3">{r.confession.content}</p>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(r.confession_id)}
                            className="px-3 py-1.5 text-xs bg-[var(--color-crimson)] text-[var(--color-paper)] rounded hover:bg-[var(--color-crimson-glow)] transition-colors font-[var(--font-syne)] flex-shrink-0"
                          >
                            Delete Confession
                          </button>
                        </div>
                        <p className="text-[10px] text-[var(--color-muted)] mt-2">
                          Reported {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </PageTransition>
    </div>
  )
}
