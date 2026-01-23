export const API_BASE_URL = "http://localhost:8080"

export type AuthStore = {
  isAuthenticated: boolean;
  token: string | null;
  email: string | null;
  password: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string | null) => void;
  setEmail: (email: string | null) => void;
  setPassword: (password: string | null) => void;
}