import { useState } from "react"
import { Link, useNavigate } from "react-router"
import useAuthStore from "../../store/auth-store"
import apiClient from "../../lib/client"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const data = await apiClient.login(email, password);
      if (data.token) {
        useAuthStore.getState().setIsAuthenticated(true);
        useAuthStore.getState().setEmail(email);
        useAuthStore.getState().setPassword(password);
        useAuthStore.getState().setToken(data.token);
        console.log("Login successful:", data);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      return;
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white rounded-lg w-[400px] p-8 shadow-lg">
        <h1 className="text-gray-900 text-4xl text-center mb-6 font-bold">Login</h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-gray-700 font-medium block mb-2">Email:</label>
            <input type="email" value={email} onChange={handleEmailChange} id="email" name="email" required className="border border-gray-300 rounded-lg w-full h-10 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="password" className="text-gray-700 font-medium block mb-2">Password:</label>
            <input type="password" value={password} onChange={handlePasswordChange} id="password" name="password" required className="border border-gray-300 rounded-lg w-full h-10 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col items-center mt-4 gap-2">
            <button type="submit" className="bg-blue-600 rounded-lg text-lg h-10 w-full cursor-pointer text-white font-medium hover:bg-blue-700">Login</button>
            <Link to="/register" className="text-blue-600 text-sm text-center mt-2 hover:underline font-medium">Register</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage