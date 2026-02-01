import { Route, Routes } from 'react-router'
import LoginPage from './pages/login/page'
import RegisterPage from './pages/register/page'
import RootPage from './pages/root/page'
import Sidebar from './pages/root/components/sidebar'
import StudentsPage from './pages/students/page'

function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<Sidebar />}>
        <Route index element={<RootPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/courses" element={<RootPage />} />
        <Route path="/instructors" element={<RootPage />} />
      </Route>
    </Routes>
  )
}

export default App
