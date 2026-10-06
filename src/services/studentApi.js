import { request } from './apiClient'

export function getStudents() {
  return request('/students')
}

export function createStudent(student) {
  return request('/students', { method: 'POST', body: student })
}

export function updateStudent(id, student) {
  return request(`/students/${id}`, { method: 'PUT', body: student })
}

export function deleteStudent(id) {
  return request(`/students/${id}`, { method: 'DELETE' })
}
