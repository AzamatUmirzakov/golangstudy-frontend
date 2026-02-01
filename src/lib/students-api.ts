import apiClient from "./client"
import useStudentsStore from "../store/students-store"

async function reloadData() {
  const setStudents = useStudentsStore.getState().setStudents
  const setGroups = useStudentsStore.getState().setGroups
  const setFaculties = useStudentsStore.getState().setFaculties

  const [students, groups, faculties] = await Promise.all([
    apiClient.get("/students"),
    apiClient.get("/groups"),
    apiClient.get("/faculties"),
  ])

  setStudents(students ? students : [])
  setGroups(groups)
  setFaculties(faculties)
}

export { reloadData }