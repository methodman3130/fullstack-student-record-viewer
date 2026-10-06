const configuredUrl =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

// Older setups pointed VITE_API_URL straight at the students collection.
export const apiBaseUrl = configuredUrl.replace(/\/+$/, '').replace(/\/students$/, '')

const TOKEN_KEY = 'srv.token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage can be unavailable (private mode); the cookie still carries the session.
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  const token = getToken()
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (response.status === 204) return null

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`)
  }

  return payload
}
