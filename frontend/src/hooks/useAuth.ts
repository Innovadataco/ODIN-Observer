import { useState, useEffect } from 'react'
import axios from 'axios'

interface User {
  id: string
  email: string
  name: string
  picture?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get('/api/auth/user', { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    window.location.href = '/api/auth/logout'
  }

  return { user, loading, logout }
}
