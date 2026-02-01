import { useState } from "react"
import StudentsHeaderCard from "./header-card"
import AddStudentSidebar from "./add-student-sidebar"
import useStudentsStore from "../../../store/students-store"

function StudentsPageHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const students = useStudentsStore((state) => state.students)
  const groups = useStudentsStore((state) => state.groups)
  const faculties = useStudentsStore((state) => state.faculties)
  return (
    <>
      <AddStudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Students</h1>
          <p className="text-gray-600 text-lg">Manage and view all registered students</p>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="cursor-pointer rounded bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 font-medium flex items-center gap-2">+ Add Student</button>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StudentsHeaderCard text="Total Students" subtext="Across all groups" number={students.length} />
        <StudentsHeaderCard text="Groups" subtext="Active groups" number={groups.length} />
        <StudentsHeaderCard text="Majors" subtext="Different majors" number={faculties.length} />
      </div>
    </>
  )
}

export default StudentsPageHeader