import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-ink-black)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm space-y-8"
      >
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-2xl font-bold font-[var(--font-playfair)] text-[var(--color-paper)]">
            JIET <span className="text-[var(--color-crimson)]">Confessions</span>
          </h1>
          <p className="text-xs text-[var(--color-muted)] font-[var(--font-syne)] mt-1 uppercase tracking-widest">
            Admin Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-[var(--color-gold-dim)]/40 rounded-lg text-sm text-[var(--color-paper)] placeholder-[var(--color-muted)] focus:border-[var(--color-gold)] transition-colors font-[var(--font-syne)]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-[var(--color-gold-dim)]/40 rounded-lg text-sm text-[var(--color-paper)] placeholder-[var(--color-muted)] focus:border-[var(--color-gold)] transition-colors font-[var(--font-syne)]"
          />

          {error && (
            <p className="text-xs text-[var(--color-crimson-glow)] font-[var(--font-syne)]">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-[var(--color-crimson)] text-[var(--color-paper)] font-semibold rounded-lg hover:bg-[var(--color-crimson-glow)] transition-colors disabled:opacity-50 font-[var(--font-syne)]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
