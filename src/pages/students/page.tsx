import { useEffect } from "react"
import StudentsPageHeader from "./components/header"
import StudentsTable from "./components/students-table"
import useStudentsStore from "../../store/students-store"
import { reloadData } from "../../lib/students-api"
import GroupsTable from "./components/groups-table"

function StudentsPage() {
  const students = useStudentsStore((state) => state.students)
  const groups = useStudentsStore((state) => state.groups)

  useEffect(() => {
    reloadData()
  }, [])

  return (
    <>
      <StudentsPageHeader />
      <StudentsTable students={students} groups={groups} />
      <GroupsTable groups={groups} students={students} />
    </>
  )
}

export default StudentsPage