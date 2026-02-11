import { useEffect, useState } from "react"
import useStudentsStore from "../../../store/students-store"
import type { Group } from "../../../lib/constants-types"
import apiClient from "../../../lib/client"
import { reloadData } from "../../../lib/students-api"

export type AddGroupSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

function AddGroupSidebar({ isOpen, onClose }: AddGroupSidebarProps) {
  const faculties = useStudentsStore((state) => state.faculties)

  const [formData, setFormData] = useState({
    group_name: "",
    faculty_id: faculties.length > 0 ? faculties[0].faculty_id : 0,
  })

  useEffect(() => {
    if (faculties.length > 0 && formData.faculty_id === 0) {
      setFormData((prev) => ({
        ...prev,
        faculty_id: faculties[0].faculty_id,
      }))
    }
  }, [faculties])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.group_name.trim()) {
      console.error("Group name is required")
      return
    }

    if (faculties.length === 0) {
      console.error("No faculties available. Please try again.")
      return
    }

    const newGroup: Omit<Group, "group_id"> = {
      ...formData,
      faculty_id: parseInt(formData.faculty_id.toString()),
    }

    apiClient.post("/groups", newGroup).then((createdGroup) => {
      console.log("Group created:", createdGroup)
    }).then(() => {
      reloadData()
    }).catch((error) => {
      console.error("Error creating group:", error)
    })

    setFormData({
      group_name: "",
      faculty_id: faculties.length > 0 ? faculties[0].faculty_id : 0,
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
          <h2 className="text-2xl font-bold text-gray-900">Add Group</h2>
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
              Group Name
            </label>
            <input
              type="text"
              name="group_name"
              value={formData.group_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter group name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty
            </label>
            {faculties.length === 0 ? (
              <p className="text-red-600 text-sm">No faculties available. Please contact an administrator.</p>
            ) : (
              <select
                name="faculty_id"
                value={formData.faculty_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {faculties.map((faculty) => (
                  <option key={faculty.faculty_id} value={faculty.faculty_id}>
                    {faculty.faculty_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={faculties.length === 0}
              className="flex-1 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Create
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

export default AddGroupSidebar
