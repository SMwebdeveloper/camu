import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  setUser: (newUser) => set({ user: newUser }),
  logOut: () => set({ user: null }),
}));
export default useAuthStore;