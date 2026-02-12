import { Route, Routes } from 'react-router'
import LoginPage from './pages/login/page'
import RegisterPage from './pages/register/page'
import RootPage from './pages/root/page'
import Sidebar from './pages/root/components/sidebar'
import StudentsPage from './pages/students/page'
import SubjectsPage from './pages/subjects/page'
import SchedulePage from './pages/schedule/page'

function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<Sidebar />}>
        <Route index element={<RootPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Route>
    </Routes>
  )
}

export default App
