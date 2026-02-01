import { useEffect, useState } from "react"
import type { Faculty } from "../../../lib/constants-types"
import apiClient from "../../../lib/client"
import { reloadData } from "../../../lib/students-api"

interface EditFacultySidebarProps {
  isOpen: boolean
  onClose: () => void
  faculty: Faculty | null
}

function EditFacultySidebar({ isOpen, onClose, faculty }: EditFacultySidebarProps) {
  const [formData, setFormData] = useState({
    faculty_name: "",
  })

  useEffect(() => {
    if (faculty) {
      setFormData({
        faculty_name: faculty.faculty_name,
      })
    }
  }, [faculty])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!faculty) return

    const updatedFaculty: Faculty = {
      faculty_id: faculty.faculty_id,
      ...formData,
    }

    apiClient.put(`/faculties/${faculty.faculty_id}`, updatedFaculty)
      .then((savedFaculty) => {
        console.log("Faculty updated:", savedFaculty)
      })
      .then(() => reloadData())
      .catch((error) => {
        console.error("Error updating faculty:", error)
      })

    onClose()
  }

  return (
    <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? "opacity-50" : "opacity-0"}`}
        onClick={onClose}
      ></div>
      <div className={`ml-auto w-96 bg-white shadow-lg p-6 overflow-y-auto relative z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Faculty</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty Name
            </label>
            <input
              type="text"
              name="faculty_name"
              value={formData.faculty_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter faculty name"
            />
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              className="flex-1 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditFacultySidebar
