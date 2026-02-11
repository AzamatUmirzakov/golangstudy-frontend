import { useEffect } from "react"
import SubjectsPageHeader from "./components/header"
import SubjectsTable from "./components/subjects-table"
import ProfessorsTable from "./components/professors-table"
import useSubjectsStore from "../../store/subjects-store"
import useStudentsStore from "../../store/students-store"
import { reloadData } from "../../lib/subjects-api"

function SubjectsPage() {
  const subjects = useSubjectsStore((state) => state.subjects)
  const professors = useSubjectsStore((state) => state.professors)
  const faculties = useStudentsStore((state) => state.faculties)

  useEffect(() => {
    reloadData()
  }, [])

  useEffect(() => {
    console.log("Subjects updated:", subjects)
  }, [subjects])

  return (
    <>
      <SubjectsPageHeader />
      <SubjectsTable subjects={subjects} faculties={faculties} professors={professors} />
      <ProfessorsTable professors={professors} faculties={faculties} />
    </>
  )
}

export default SubjectsPage
