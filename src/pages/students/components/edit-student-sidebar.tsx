import { useEffect, useState } from "react"
import type { Student } from "../../../lib/constants-types"
import useStudentsStore from "../../../store/students-store"
import apiClient from "../../../lib/client"
import { reloadData } from "../../../lib/students-api"

export type EditStudentSidebarProps = {
  isOpen: boolean
  onClose: () => void
  student: Student | null
}

function EditStudentSidebar({ isOpen, onClose, student }: EditStudentSidebarProps) {
  const groups = useStudentsStore((state) => state.groups)
  const normalizeDate = (value: string) => {
    if (!value) return ""
    if (value.includes("T")) return value.split("T")[0]
    return value
  }

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "M" as const,
    birth_date: "",
    group_id: groups.length > 0 ? groups[0].group_id : 0,
  })

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        gender: student.gender,
        birth_date: normalizeDate(student.birth_date),
        group_id: student.group_id,
      })
    }
  }, [student])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!student) return

    const updatedStudent: Student = {
      student_id: student.student_id,
      ...formData,
      group_id: parseInt(formData.group_id.toString()),
    }

    apiClient.put(`/student/${student.student_id}`, updatedStudent)
      .then((savedStudent) => {
        console.log("Student updated:", savedStudent)
      })
      .then(() => reloadData())
      .catch((error) => {
        console.error("Error updating student:", error)
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
          <h2 className="text-2xl font-bold text-gray-900">Edit Student</h2>
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
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date
            </label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group
            </label>
            <select
              name="group_id"
              value={formData.group_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {groups.map((group) => (
                <option key={group.group_id} value={group.group_id}>
                  {group.group_name}
                </option>
              ))}
            </select>
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

export default EditStudentSidebar
