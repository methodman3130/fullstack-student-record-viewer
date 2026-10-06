import { request, setToken } from './apiClient'

export async function register(credentials) {
  const { user, token } = await request('/auth/register', {
    method: 'POST',
    body: credentials,
  })
  setToken(token)
  return user
}

export async function login(credentials) {
  const { user, token } = await request('/auth/login', {
    method: 'POST',
    body: credentials,
  })
  setToken(token)
  return user
}

export async function logout() {
  try {
    await request('/auth/logout', { method: 'POST' })
  } finally {
    setToken(null)
  }
}

export async function getCurrentUser() {
  const { user } = await request('/auth/me')
  return user
}
