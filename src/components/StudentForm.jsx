import { useState } from 'react'

const emptyForm = { name: '', section: '', scores: '' }

function toFormValues(student) {
  if (!student) return emptyForm

  return {
    name: student.name ?? '',
    section: student.section ?? '',
    scores: (student.scores ?? []).join(', '),
  }
}

function StudentForm({ student, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormValues(student))
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = Boolean(student)

  function updateField(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const scores = form.scores
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .map(Number)

    if (!scores.length || scores.some((score) => Number.isNaN(score))) {
      setError('Enter at least one score as comma-separated numbers, e.g. 90, 88, 95.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await onSubmit({ name: form.name.trim(), section: form.section.trim(), scores })
      if (!isEditing) setForm(emptyForm)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="card border-0 shadow-sm mb-4" aria-label="Student form">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">{isEditing ? `Edit ${student.name}` : 'Add a new student'}</h2>

        <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label fw-semibold" htmlFor="student-name">Name</label>
            <input
              id="student-name"
              className="form-control"
              value={form.name}
              onChange={updateField('name')}
              placeholder="e.g. Ana Santos"
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold" htmlFor="student-section">Section</label>
            <input
              id="student-section"
              className="form-control"
              value={form.section}
              onChange={updateField('section')}
              placeholder="e.g. A"
              required
            />
          </div>
          <div className="col-md-5">
            <label className="form-label fw-semibold" htmlFor="student-scores">Scores</label>
            <input
              id="student-scores"
              className="form-control"
              value={form.scores}
              onChange={updateField('scores')}
              placeholder="90, 88, 95"
              required
            />
          </div>
          <div className="col-12 d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add student'}
            </button>
            {isEditing && (
              <button className="btn btn-outline-secondary" type="button" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}
      </div>
    </section>
  )
}

export default StudentForm
