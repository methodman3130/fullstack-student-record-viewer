import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../services/authApi'

export function AuthProvider({ enabled = true, children }) {
  const [user, setUser] = useState(null)
  const [isRestoring, setIsRestoring] = useState(enabled)

  // Restore the session on load so a refresh does not sign the user out.
  useEffect(() => {
    if (!enabled) return undefined

    let cancelled = false

    getCurrentUser()
      .then((restored) => {
        if (!cancelled) setUser(restored)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setIsRestoring(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled])

  const login = useCallback(async (credentials) => {
    setUser(await loginRequest(credentials))
  }, [])

  const register = useCallback(async (credentials) => {
    setUser(await registerRequest(credentials))
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isRestoring,
      login,
      register,
      logout,
    }),
    [user, isRestoring, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
