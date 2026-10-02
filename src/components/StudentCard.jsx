import { calculateAverage, hasPassed } from '../utils/studentCalculations'

function StudentCard({ student }) {
  const average = calculateAverage(student.scores)
  const passed = hasPassed(student.scores)

  return (
    <article className="card h-100 border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between gap-3 mb-3">
          <div>
            <p className="text-secondary text-uppercase small fw-semibold mb-1">Section {student.section}</p>
            <h2 className="h4 mb-0">{student.name}</h2>
          </div>
          <span className={`badge align-self-start ${passed ? 'text-bg-success' : 'text-bg-danger'}`}>
            {passed ? 'Passed' : 'Failed'}
          </span>
        </div>

        <div className="border-top pt-3 d-flex justify-content-between align-items-end">
          <div>
            <p className="mb-1 text-secondary small">Scores</p>
            <p className="mb-0 fw-semibold">{student.scores.join(' · ')}</p>
          </div>
          <div className="text-end">
            <p className="mb-1 text-secondary small">Average</p>
            <p className="mb-0 fs-4 fw-bold text-primary">{average.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default StudentCard
