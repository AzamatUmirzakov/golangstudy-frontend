import { useState } from "react"
import type { Student } from "../../../lib/constants-types"
import { reloadData } from "../../../lib/students-api"
import apiClient from "../../../lib/client"
import EditStudentSidebar from "./edit-student-sidebar"

export type StudentsTableProps = {
  students: Student[]
  groups: Array<{ group_id: number; group_name: string }>
}

function StudentsTable({ students, groups }: StudentsTableProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setIsEditOpen(true)
  }

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedStudent) return

    apiClient.delete(`/student/${selectedStudent.student_id}`)
      .then(() => reloadData())
      .catch((error) => {
        console.error("Error deleting student:", error)
      })
      .finally(() => {
        setIsDeleteOpen(false)
        setSelectedStudent(null)
      })
  }

  const handleCloseEdit = () => {
    setIsEditOpen(false)
    setSelectedStudent(null)
  }

  return (
    <>
      <EditStudentSidebar
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        student={selectedStudent}
      />
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isDeleteOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${isDeleteOpen ? "opacity-40" : "opacity-0"}`}
          onClick={() => {
            setIsDeleteOpen(false)
            setSelectedStudent(null)
          }}
        ></div>
        <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-50 transition-transform duration-300 ${isDeleteOpen ? "scale-100" : "scale-95"}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Student</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete {selectedStudent?.first_name} {selectedStudent?.last_name}?
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
                setSelectedStudent(null)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Students List</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">ID</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Email</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Group</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length ? students.map((student: Student) => (
              <tr key={student.student_id}>
                <td className="py-2 px-4 border-b border-gray-200">{student.student_id}</td>
                <td className="py-2 px-4 border-b border-gray-200">{student.first_name} {student.last_name}</td>
                <td className="py-2 px-4 border-b border-gray-200">{student.email}</td>
                <td className="py-2 px-4 border-b border-gray-200">{groups.find(group => group.group_id === student.group_id)?.group_name || "Unknown"}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    className="cursor-pointer text-blue-600 hover:text-blue-800 mr-4"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteClick(student)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="py-2 px-4 border-b border-gray-200 text-center" colSpan={5}>No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default StudentsTable
