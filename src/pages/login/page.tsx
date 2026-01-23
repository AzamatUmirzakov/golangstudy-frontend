import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { login } from "../../lib/auth-api"
import useAuthStore from "../../store/auth-store"

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
      const data = await login(email, password);
      if (data.token) {
        useAuthStore.getState().setIsAuthenticated(true);
        useAuthStore.getState().setToken(data.token);
        useAuthStore.getState().setEmail(email);
        useAuthStore.getState().setPassword(password);
        console.log("Login successful:", data);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      return;
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-[#16161a] rounded-md w-[400px] p-6">
        <h1 className="text-white text-4xl text-center mb-5">Login</h1>

        <form className="flex flex-col gap-4 text-white" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" value={email} onChange={handleEmailChange} id="email" name="email" required className="border border-gray-300 rounded-md w-full h-10" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" value={password} onChange={handlePasswordChange} id="password" name="password" required className="border border-gray-300 rounded-md w-full h-10" />
          </div>
          <div className="flex flex-col items-center mt-4 gap-2">
            <button type="submit" className="bg-blue-500 rounded-md text-lg h-10 w-full cursor-pointer text-white">Login</button>
            <Link to="/register" className="text-blue-400 text-sm text-center mt-2 hover:underline">Register</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage