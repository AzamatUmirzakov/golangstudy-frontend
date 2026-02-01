import { useState } from "react"
import { type Faculty, type Group, type Student } from "../../../lib/constants-types"
import apiClient from "../../../lib/client"
import { reloadData } from "../../../lib/students-api"
import EditFacultySidebar from "./edit-faculty-sidebar"
import AddFacultySidebar from "./add-faculty-sidebar"

export type FacultiesTableProps = {
  faculties: Array<Faculty>;
  groups: Array<Group>;
  students: Array<Student>;
};

function FacultiesTable({ faculties, groups, students }: FacultiesTableProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleEdit = (faculty: Faculty) => {
    setSelectedFaculty(faculty)
    setIsEditOpen(true)
  }

  const handleDeleteClick = (faculty: Faculty) => {
    setSelectedFaculty(faculty)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedFaculty) return

    apiClient.delete(`/faculties/${selectedFaculty.faculty_id}`)
      .then(() => reloadData())
      .catch((error) => {
        console.error("Error deleting faculty:", error)
        alert("Error deleting faculty. Please try again.")
      })
      .finally(() => {
        setIsDeleteOpen(false)
        setSelectedFaculty(null)
      })
  }

  const handleCloseEdit = () => {
    setIsEditOpen(false)
    setSelectedFaculty(null)
  }

  const handleCloseAdd = () => {
    setIsAddOpen(false)
  }

  return (
    <>
      <AddFacultySidebar
        isOpen={isAddOpen}
        onClose={handleCloseAdd}
      />
      <EditFacultySidebar
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        faculty={selectedFaculty}
      />
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isDeleteOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${isDeleteOpen ? "opacity-40" : "opacity-0"}`}
          onClick={() => {
            setIsDeleteOpen(false)
            setSelectedFaculty(null)
          }}
        ></div>
        <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-50 transition-transform duration-300 ${isDeleteOpen ? "scale-100" : "scale-95"}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Faculty</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete {selectedFaculty?.faculty_name}?
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
                setSelectedFaculty(null)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold mb-4">Faculties List</h2>
          <button
            className="mb-4 px-4 py-2 bg-green-600 text-white cursor-pointer rounded-md hover:bg-green-700"
            onClick={() => setIsAddOpen(true)}
          >
            Add Faculty
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Faculty ID</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Faculty Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Number of Groups</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Number of Students</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((faculty) => (
              <tr key={faculty.faculty_id}>
                <td className="py-2 px-4 border-b border-gray-200">{faculty.faculty_id}</td>
                <td className="py-2 px-4 border-b border-gray-200">{faculty.faculty_name}</td>
                <td className="py-2 px-4 border-b border-gray-200">{
                  groups.filter(group => group.faculty_id === faculty.faculty_id).length
                }</td>
                <td className="py-2 px-4 border-b border-gray-200">{
                  students.filter(student => {
                    const group = groups.find(g => g.group_id === student.group_id);
                    return group?.faculty_id === faculty.faculty_id;
                  }).length
                }</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    className="cursor-pointer text-blue-600 hover:text-blue-800 mr-4"
                    onClick={() => handleEdit(faculty)}
                  >
                    Edit
                  </button>
                  <button
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteClick(faculty)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default FacultiesTable