import { useState } from "react"
import AddSubjectSidebar from "./add-subject-sidebar"
import useSubjectsStore from "../../../store/subjects-store"
import useStudentsStore from "../../../store/students-store"

export type HeaderCardProps = {
  text: string
  subtext: string
  number: number
}

function HeaderCard({ text, subtext, number }: HeaderCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <p className="text-gray-600 text-sm mb-1">{text}</p>
      <p className="text-4xl font-bold text-gray-900 mb-1">{number}</p>
      <p className="text-gray-500 text-xs">{subtext}</p>
    </div>
  )
}

function SubjectsPageHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const subjects = useSubjectsStore((state) => state.subjects)
  const professors = useSubjectsStore((state) => state.professors)
  const faculties = useStudentsStore((state) => state.faculties)

  return (
    <>
      <AddSubjectSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Subjects</h1>
          <p className="text-gray-600 text-lg">Manage and view all available subjects</p>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="cursor-pointer rounded bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 font-medium flex items-center gap-2"
        >
          + Add Subject
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <HeaderCard text="Total Subjects" subtext="Across all faculties" number={subjects.length} />
        <HeaderCard text="Professors" subtext="Teaching staff" number={professors.length} />
        <HeaderCard text="Faculties" subtext="Academic departments" number={faculties.length} />
      </div>
    </>
  )
}

export default SubjectsPageHeader
