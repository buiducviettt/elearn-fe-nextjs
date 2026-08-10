import { KEY_STORAGE_USER } from "@/constants/common";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type TUseUserState = {
  loading: boolean;
  user:
    | {
        id: number;
        token: string;
        user_email: string;
        user_nicename: string;
        urlLogout: string;
      }
    | undefined;
};
type TUserUserAction = {
  setUser: (user: TUseUserState["user"]) => void;
  resetUser: () => void;
  setLoading: (loading: TUseUserState["loading"]) => void;
};

const useUser = create<TUseUserState & TUserUserAction>()(
  devtools(
    persist(
      (set) => ({
        user: undefined,
        loading: false,
        setUser: (user) => set({ user }),
        resetUser: () => set({ user: undefined }),
        setLoading: (loading) => set({ loading }),
      }),
      {
        name: KEY_STORAGE_USER, // Key for local storage
      },
    ),
  ),
);

export default useUser;
