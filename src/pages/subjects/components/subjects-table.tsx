import { useState } from "react"
import type { Subject, Faculty, Professor } from "../../../lib/constants-types"
import { reloadData } from "../../../lib/subjects-api"
import apiClient from "../../../lib/client"
import EditSubjectSidebar from "./edit-subject-sidebar"

export type SubjectsTableProps = {
  subjects: Subject[]
  faculties: Faculty[]
  professors: Professor[]
}

function SubjectsTable({ subjects, faculties, professors }: SubjectsTableProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsEditOpen(true)
  }

  const handleDeleteClick = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedSubject) return

    apiClient.delete(`/subject/${selectedSubject.subject_id}`)
      .then(() => reloadData())
      .catch((error) => {
        console.error("Error deleting subject:", error)
      })
      .finally(() => {
        setIsDeleteOpen(false)
        setSelectedSubject(null)
      })
  }

  const handleCloseEdit = () => {
    setIsEditOpen(false)
    setSelectedSubject(null)
  }

  const getFacultyName = (facultyId: number) => {
    const faculty = faculties.find((f) => f.faculty_id === facultyId)
    return faculty ? faculty.faculty_name : "Unknown"
  }

  const getProfessorName = (professorId: number) => {
    const professor = professors.find((p) => p.professor_id === professorId)
    return professor ? `${professor.first_name} ${professor.last_name}` : "Unknown"
  }

  return (
    <>
      <EditSubjectSidebar
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        subject={selectedSubject}
        faculties={faculties}
        professors={professors}
      />
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isDeleteOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${isDeleteOpen ? "opacity-40" : "opacity-0"}`}
          onClick={() => {
            setIsDeleteOpen(false)
            setSelectedSubject(null)
          }}
        ></div>
        <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-50 transition-transform duration-300 ${isDeleteOpen ? "scale-100" : "scale-95"}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Subject</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete {selectedSubject?.subject_name}?
          </p>
          <div className="flex gap-3">
            <button
              className="flex-1 cursor-pointer bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium"
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
            <button
              className="flex-1 cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium"
              onClick={() => {
                setIsDeleteOpen(false)
                setSelectedSubject(null)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Subjects List</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">ID</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Subject Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Faculty</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Professor</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length ? subjects.map((subject: Subject) => (
              <tr key={subject.subject_id}>
                <td className="py-2 px-4 border-b border-gray-200">{subject.subject_id}</td>
                <td className="py-2 px-4 border-b border-gray-200">{subject.subject_name}</td>
                <td className="py-2 px-4 border-b border-gray-200">{getFacultyName(subject.faculty_id)}</td>
                <td className="py-2 px-4 border-b border-gray-200">{getProfessorName(subject.professor_id)}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2 cursor-pointer"
                    onClick={() => handleEdit(subject)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                    onClick={() => handleDeleteClick(subject)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                  No subjects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default SubjectsTable
