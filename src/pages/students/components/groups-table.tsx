import { useState } from "react"
import type { Group, Student } from "../../../lib/constants-types"
import apiClient from "../../../lib/client"
import { reloadData } from "../../../lib/students-api"
import EditGroupSidebar from "./edit-group-sidebar"
import AddGroupSidebar from "./add-group-sidebar"

export type GroupsTableProps = {
  groups: Array<Group>;
  students: Array<Student>;
};

function GroupsTable({ groups, students }: GroupsTableProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleEdit = (group: Group) => {
    setSelectedGroup(group)
    setIsEditOpen(true)
  }

  const handleDeleteClick = (group: Group) => {
    setSelectedGroup(group)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedGroup) return

    apiClient.delete(`/groups/${selectedGroup.group_id}`)
      .then(() => reloadData())
      .catch((error) => {
        console.error("Error deleting group:", error)
      })
      .finally(() => {
        setIsDeleteOpen(false)
        setSelectedGroup(null)
      })
  }

  const handleCloseEdit = () => {
    setIsEditOpen(false)
    setSelectedGroup(null)
  }

  const handleCloseAdd = () => {
    setIsAddOpen(false)
  }

  return (
    <>
      <AddGroupSidebar
        isOpen={isAddOpen}
        onClose={handleCloseAdd}
      />
      <EditGroupSidebar
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        group={selectedGroup}
      />
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isDeleteOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${isDeleteOpen ? "opacity-40" : "opacity-0"}`}
          onClick={() => {
            setIsDeleteOpen(false)
            setSelectedGroup(null)
          }}
        ></div>
        <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-50 transition-transform duration-300 ${isDeleteOpen ? "scale-100" : "scale-95"}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Group</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete {selectedGroup?.group_name}?
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
                setSelectedGroup(null)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold mb-4">Groups List</h2>
          <button
            className="mb-4 px-4 py-2 bg-green-600 text-white cursor-pointer rounded-md hover:bg-green-700"
            onClick={() => setIsAddOpen(true)}
          >
            Add Group
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Group Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Members</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.length ? groups.map((group) => (
              <tr key={group.group_id}>
                <td className="py-2 px-4 border-b border-gray-200">{group.group_name}</td>
                <td className="py-2 px-4 border-b border-gray-200">{students.filter(student => student.group_id === group.group_id).length}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    className="cursor-pointer text-blue-600 hover:text-blue-800 mr-4"
                    onClick={() => handleEdit(group)}
                  >
                    Edit
                  </button>
                  <button
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteClick(group)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="py-2 px-4 border-b border-gray-200 text-center" colSpan={3}>No groups found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default GroupsTable;