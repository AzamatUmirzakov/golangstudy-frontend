import { useState } from "react"
import type { Professor, Faculty } from "../../../lib/constants-types"
import { reloadData } from "../../../lib/subjects-api"
import apiClient from "../../../lib/client"
import EditProfessorSidebar from "./edit-professor-sidebar"
import AddProfessorSidebar from "./add-professor-sidebar"

export type ProfessorsTableProps = {
  professors: Professor[]
  faculties: Faculty[]
}

function ProfessorsTable({ professors, faculties }: ProfessorsTableProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleEdit = (professor: Professor) => {
    setSelectedProfessor(professor)
    setIsEditOpen(true)
  }

  const handleDeleteClick = (professor: Professor) => {
    setSelectedProfessor(professor)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedProfessor) return

    apiClient.delete(`/professor/${selectedProfessor.professor_id}`)
      .then(() => reloadData())
      .catch((error) => {
        console.error("Error deleting professor:", error)
      })
      .finally(() => {
        setIsDeleteOpen(false)
        setSelectedProfessor(null)
      })
  }

  const handleCloseEdit = () => {
    setIsEditOpen(false)
    setSelectedProfessor(null)
  }

  const getFacultyName = (facultyId: number) => {
    const faculty = faculties.find((f) => f.faculty_id === facultyId)
    return faculty ? faculty.faculty_name : "Unknown"
  }

  return (
    <>
      <AddProfessorSidebar isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditProfessorSidebar
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        professor={selectedProfessor}
        faculties={faculties}
      />
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isDeleteOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${isDeleteOpen ? "opacity-40" : "opacity-0"}`}
          onClick={() => {
            setIsDeleteOpen(false)
            setSelectedProfessor(null)
          }}
        ></div>
        <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-50 transition-transform duration-300 ${isDeleteOpen ? "scale-100" : "scale-95"}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Professor</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete {selectedProfessor?.first_name} {selectedProfessor?.last_name}?
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
                setSelectedProfessor(null)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Professors List</h2>
          <button
            onClick={() => setIsAddOpen(true)}
            className="cursor-pointer rounded bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 font-medium"
          >
            + Add Professor
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">ID</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Email</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Faculty</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {professors.length ? professors.map((professor: Professor) => (
              <tr key={professor.professor_id}>
                <td className="py-2 px-4 border-b border-gray-200">{professor.professor_id}</td>
                <td className="py-2 px-4 border-b border-gray-200">{professor.first_name} {professor.last_name}</td>
                <td className="py-2 px-4 border-b border-gray-200">{professor.email}</td>
                <td className="py-2 px-4 border-b border-gray-200">{getFacultyName(professor.faculty_id)}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2 cursor-pointer"
                    onClick={() => handleEdit(professor)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                    onClick={() => handleDeleteClick(professor)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                  No professors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ProfessorsTable
