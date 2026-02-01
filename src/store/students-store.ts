import { type StudentStore, type Student, type Group, type Faculty } from "../lib/constants-types"
import { create } from "zustand";

const useStudentsStore = create<StudentStore>((set) => ({
  students: [],
  setStudents: (students: Array<Student>) => set({ students }),
  addStudent: (student: Student) => set((state: StudentStore) => ({ students: [...state.students, student] })),
  updateStudent: (student: Student) => set((state: StudentStore) => ({
    students: state.students.map((s) => s.student_id === student.student_id ? student : s)
  })),
  deleteStudent: (student_id: number) => set((state: StudentStore) => ({
    students: state.students.filter((s) => s.student_id !== student_id)
  })),
  groups: [],
  setGroups: (groups: Array<Group>) => set({ groups }),
  addGroup: (group: Group) => set((state: StudentStore) => ({ groups: [...state.groups, group] })),
  updateGroup: (group: Group) => set((state: StudentStore) => ({
    groups: state.groups.map((g) => g.group_id === group.group_id ? group : g)
  })),
  deleteGroup: (group_id: number) => set((state: StudentStore) => ({
    groups: state.groups.filter((g) => g.group_id !== group_id)
  })),
  faculties: [],
  setFaculties: (faculties: Array<Faculty>) => set({ faculties }),
  addFaculty: (faculty: Faculty) => set((state: StudentStore) => ({ faculties: [...state.faculties, faculty] })),
  updateFaculty: (faculty: Faculty) => set((state: StudentStore) => ({
    faculties: state.faculties.map((f) => f.faculty_id === faculty.faculty_id ? faculty : f)
  })),
  deleteFaculty: (faculty_id: number) => set((state: StudentStore) => ({
    faculties: state.faculties.filter((f) => f.faculty_id !== faculty_id)
  })),
}))

export default useStudentsStore;