import { useState, useEffect } from 'react'
import axios from 'axios'

interface User {
  id: string
  email: string
  name: string
  picture?: string
  role?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('odin_token')
    if (token) {
      axios
        .get('/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('odin_token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      // Fallback to session-based auth (Passport)
      axios
        .get('/api/auth/user', { withCredentials: true })
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null))
        .finally(() => setLoading(false))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('odin_token')
    window.location.href = '/api/auth/logout'
  }

  return { user, loading, logout }
}
