import { useEffect, useState } from "react"
import type { Subject, Faculty, Professor } from "../../../lib/constants-types"
import useSubjectsStore from "../../../store/subjects-store"
import useStudentsStore from "../../../store/students-store"
import apiClient from "../../../lib/client"
import { reloadData } from "../../../lib/subjects-api"

export type EditSubjectSidebarProps = {
  isOpen: boolean
  onClose: () => void
  subject: Subject | null
  faculties: Faculty[]
  professors: Professor[]
}

function EditSubjectSidebar({ isOpen, onClose, subject, faculties, professors }: EditSubjectSidebarProps) {
  const [formData, setFormData] = useState({
    subject_name: "",
    faculty_id: faculties.length > 0 ? faculties[0].faculty_id : 0,
    professor_id: professors.length > 0 ? professors[0].professor_id : 0,
  })

  useEffect(() => {
    if (subject) {
      setFormData({
        subject_name: subject.subject_name,
        faculty_id: subject.faculty_id,
        professor_id: subject.professor_id,
      })
    }
  }, [subject])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject) return

    const updatedSubject: Subject = {
      subject_id: subject.subject_id,
      ...formData,
      faculty_id: parseInt(formData.faculty_id.toString()),
      professor_id: parseInt(formData.professor_id.toString()),
    }

    apiClient.put(`/subject/${subject.subject_id}`, updatedSubject)
      .then((savedSubject) => {
        console.log("Subject updated:", savedSubject)
      })
      .then(() => reloadData())
      .catch((error) => {
        console.error("Error updating subject:", error)
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
          <h2 className="text-2xl font-bold text-gray-900">Edit Subject</h2>
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
              Subject Name
            </label>
            <input
              type="text"
              name="subject_name"
              value={formData.subject_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty
            </label>
            <select
              name="faculty_id"
              value={formData.faculty_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {faculties.map((faculty: Faculty) => (
                <option key={faculty.faculty_id} value={faculty.faculty_id}>
                  {faculty.faculty_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professor
            </label>
            <select
              name="professor_id"
              value={formData.professor_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {professors.map((professor: Professor) => (
                <option key={professor.professor_id} value={professor.professor_id}>
                  {professor.first_name} {professor.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              Update Subject
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

export default EditSubjectSidebar
