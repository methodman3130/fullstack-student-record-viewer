import { useEffect, useMemo, useState } from 'react'
import StudentList from './components/StudentList'
import { students as starterStudents } from './data/students'
import { getStudents } from './services/studentApi'
import { calculateAverage, hasPassed } from './utils/studentCalculations'
import './App.css'

const shouldUseApi = import.meta.env.VITE_USE_API === 'true'

function App() {
  const [students, setStudents] = useState(starterStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState('All')
  const [isLoading, setIsLoading] = useState(shouldUseApi)
  const [loadError, setLoadError] = useState('')

  // The app remains usable with starter data until a MongoDB API is enabled.
  useEffect(() => {
    if (!shouldUseApi) return
    getStudents()
      .then((records) => setStudents(records))
      .catch(() => setLoadError('Could not load MongoDB records. Showing starter data instead.'))
      .finally(() => setIsLoading(false))
  }, [])

  const sections = useMemo(
    () => [...new Set(students.map((student) => student.section))].sort(),
    [students],
  )

  const filteredStudents = students.filter((student) => {
    const matchesName = student.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
    const matchesSection =
      selectedSection === 'All' || student.section === selectedSection

    return matchesName && matchesSection
  })

  const passingStudents = filteredStudents.filter((student) =>
    hasPassed(student.scores),
  )

  const classAverage = filteredStudents.length
    ? filteredStudents.reduce(
        (total, student) => total + calculateAverage(student.scores),
        0,
      ) / filteredStudents.length
    : 0

  return (
    <main className="py-5">
      <div className="container">
        <header className="mb-4">
          <p className="text-primary fw-semibold text-uppercase small mb-2">Academic dashboard</p>
          <h1 className="display-6 fw-bold mb-2">Student Record Viewer</h1>
          <p className="text-secondary mb-0">Search students, filter sections, and review calculated academic status.</p>
        </header>

        <section className="card border-0 shadow-sm mb-4" aria-label="Student filters">
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-7">
                <label className="form-label fw-semibold" htmlFor="student-search">Search by student name</label>
                <input
                  id="student-search"
                  className="form-control"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="e.g. Ana Santos"
                />
              </div>
              <div className="col-md-5">
                <label className="form-label fw-semibold" htmlFor="section-filter">Section</label>
                <select
                  id="section-filter"
                  className="form-select"
                  value={selectedSection}
                  onChange={(event) => setSelectedSection(event.target.value)}
                >
                  <option value="All">All sections</option>
                  {sections.map((section) => <option key={section} value={section}>Section {section}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        {loadError && <div className="alert alert-warning" role="alert">{loadError}</div>}
        {isLoading && <div className="alert alert-info" role="status">Loading student records…</div>}

        <section className="row g-3 mb-4" aria-label="Student summary">
          <div className="col-sm-4"><div className="summary-card"><span>Students found</span><strong>{filteredStudents.length}</strong></div></div>
          <div className="col-sm-4"><div className="summary-card"><span>Passing students</span><strong>{passingStudents.length}</strong></div></div>
          <div className="col-sm-4"><div className="summary-card"><span>Class average</span><strong>{classAverage.toFixed(2)}</strong></div></div>
        </section>

        {filteredStudents.length > 0 ? (
          <StudentList students={filteredStudents} />
        ) : (
          <div className="empty-state text-center rounded-3 p-5">
            <h2 className="h4">No students found</h2>
            <p className="mb-0 text-secondary">Try a different name or section.</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default App
