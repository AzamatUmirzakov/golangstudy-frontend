import { useEffect } from "react"
import useAuthStore from "../../store/auth-store"
import { useNavigate } from "react-router"

function RootPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true })
    }
  }, [isAuthenticated, navigate])
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the University App</h1>
      <p className="text-gray-600">Select an option from the sidebar to get started.</p>
    </div>
  )
}

export default RootPage