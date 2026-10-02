const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/students'

export async function getStudents() {
  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(`Student API request failed with status ${response.status}`)
  }

  return response.json()
}
