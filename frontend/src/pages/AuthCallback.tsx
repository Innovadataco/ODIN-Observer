import { useEffect } from 'react'

export default function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('odin_token', token)
    }
    window.location.href = '/dashboard'
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Autenticando...</p>
      </div>
    </div>
  )
}
