import { type SubjectStore, type Subject, type Professor } from "../lib/constants-types"
import { create } from "zustand";

const useSubjectsStore = create<SubjectStore>((set) => ({
  subjects: [],
  setSubjects: (subjects: Array<Subject>) => set({ subjects }),
  addSubject: (subject: Subject) => set((state: SubjectStore) => ({ subjects: [...state.subjects, subject] })),
  updateSubject: (subject: Subject) => set((state: SubjectStore) => ({
    subjects: state.subjects.map((s) => s.subject_id === subject.subject_id ? subject : s)
  })),
  deleteSubject: (subject_id: number) => set((state: SubjectStore) => ({
    subjects: state.subjects.filter((s) => s.subject_id !== subject_id)
  })),
  professors: [],
  setProfessors: (professors: Array<Professor>) => set({ professors }),
  addProfessor: (professor: Professor) => set((state: SubjectStore) => ({ professors: [...state.professors, professor] })),
  updateProfessor: (professor: Professor) => set((state: SubjectStore) => ({
    professors: state.professors.map((p) => p.professor_id === professor.professor_id ? professor : p)
  })),
  deleteProfessor: (professor_id: number) => set((state: SubjectStore) => ({
    professors: state.professors.filter((p) => p.professor_id !== professor_id)
  })),
}))

export default useSubjectsStore;
