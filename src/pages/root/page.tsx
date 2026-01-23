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
      <h1 className="text-white text-4xl text-center mb-5">Root page</h1>
    </div>
  )
}

export default RootPage