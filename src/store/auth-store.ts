import { create } from "zustand";
import type { AuthStore } from "../lib/constants-types";
import { persist } from "zustand/middleware";

const useAuthStore = create<AuthStore>()(persist((set) => ({
  isAuthenticated: false,
  token: null,
  email: null,
  password: null,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setToken: (token: string | null) => set({ token }),
  setEmail: (email: string | null) => set({ email }),
  setPassword: (password: string | null) => set({ password }),
}), {
  name: "auth-storage",
}))

export default useAuthStore;