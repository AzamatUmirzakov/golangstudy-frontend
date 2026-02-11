import apiClient from "./client"
import useSubjectsStore from "../store/subjects-store"
import useStudentsStore from "../store/students-store"

async function reloadData() {
  console.log("Reloading subjects data...")
  const setSubjects = useSubjectsStore.getState().setSubjects
  const setProfessors = useSubjectsStore.getState().setProfessors
  const setFaculties = useStudentsStore.getState().setFaculties

  const [subjects, professors, faculties] = await Promise.all([
    apiClient.get("/subjects"),
    apiClient.get("/professors"),
    apiClient.get("/faculties"),
  ])

  console.log("Subjects:", subjects)
  console.log("Professors:", professors)
  console.log("Faculties:", faculties)

  setSubjects(subjects ? subjects : [])
  setProfessors(professors ? professors : [])
  setFaculties(faculties ? faculties : [])
}

export { reloadData }
