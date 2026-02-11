export const API_BASE_URL = "http://localhost:8080"

export type AuthStore = {
  isAuthenticated: boolean;
  email: string | null;
  token: string | null;
  password: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setEmail: (email: string | null) => void;
  setPassword: (password: string | null) => void;
  setToken: (token: string | null) => void;
}

export type Student = {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: "M" | "F";
  birth_date: string;
  group_id: number;
}

export type Group = {
  group_id: number;
  faculty_id: number;
  group_name: string;
}

export type Faculty = {
  faculty_id: number;
  faculty_name: string;
}

export type Subject = {
  subject_id: number;
  subject_name: string;
  faculty_id: number;
  professor_id: number;
}

export type Professor = {
  professor_id: number;
  first_name: string;
  last_name: string;
  email: string;
  faculty_id: number;
}

export type SubjectStore = {
  subjects: Array<Subject>;
  setSubjects: (subjects: Array<Subject>) => void;
  addSubject: (subject: Subject) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (subject_id: number) => void;
  professors: Array<Professor>;
  setProfessors: (professors: Array<Professor>) => void;
  addProfessor: (professor: Professor) => void;
  updateProfessor: (professor: Professor) => void;
  deleteProfessor: (professor_id: number) => void;
}

export type StudentStore = {
  students: Array<Student>;
  setStudents: (students: Array<Student>) => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (student_id: number) => void;
  groups: Array<Group>;
  setGroups: (groups: Array<Group>) => void;
  addGroup: (group: Group) => void;
  updateGroup: (group: Group) => void;
  deleteGroup: (group_id: number) => void;
  faculties: Array<Faculty>;
  setFaculties: (faculties: Array<Faculty>) => void;
  addFaculty: (faculty: Faculty) => void;
  updateFaculty: (faculty: Faculty) => void;
  deleteFaculty: (faculty_id: number) => void;
}