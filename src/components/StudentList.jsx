import StudentCard from './StudentCard'

function StudentList({ students }) {
  return (
    <section className="row g-4" aria-label="Student records">
      {students.map((student) => (
        <div className="col-md-6 col-xl-4" key={student.id ?? student._id}>
          <StudentCard student={student} />
        </div>
      ))}
    </section>
  )
}

export default StudentList
