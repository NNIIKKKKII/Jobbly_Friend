import { useEffect, useState } from 'react'
import { AuthContext } from './authContext.js'

const AUTH_STORAGE_KEY = 'job-friend-auth-user'

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY)

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }

      setLoading(false)
    }, 600)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <AuthContext.Provider value={{ loading, user }}>
      {children}
    </AuthContext.Provider>
  )
}
