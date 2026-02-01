import { create } from "zustand";
import type { AuthStore } from "../lib/constants-types";
import { persist } from "zustand/middleware";

const useAuthStore = create<AuthStore>()(persist((set) => ({
  isAuthenticated: false,
  email: null,
  password: null,
  token: null,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setEmail: (email: string | null) => set({ email }),
  setPassword: (password: string | null) => set({ password }),
  setToken: (token: string | null) => set({ token }),
}), {
  name: "auth-storage",
}))

export default useAuthStore;