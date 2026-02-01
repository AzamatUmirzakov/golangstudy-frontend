import { useEffect } from "react"
import StudentsPageHeader from "./components/header"
import StudentsTable from "./components/students-table"
import useStudentsStore from "../../store/students-store"
import { reloadData } from "../../lib/students-api"
import GroupsTable from "./components/groups-table"
import FacultiesTable from "./components/faculties-table"

function StudentsPage() {
  const students = useStudentsStore((state) => state.students)
  const groups = useStudentsStore((state) => state.groups)
  const faculties = useStudentsStore((state) => state.faculties)

  useEffect(() => {
    reloadData()
  }, [])

  return (
    <>
      <StudentsPageHeader />
      <StudentsTable students={students} groups={groups} />
      <GroupsTable groups={groups} students={students} />
      <FacultiesTable faculties={faculties} groups={groups} students={students} />
    </>
  )
}

export default StudentsPage