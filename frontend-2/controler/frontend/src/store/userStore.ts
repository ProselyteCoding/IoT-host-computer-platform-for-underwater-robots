// src/store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import Cookies from "js-cookie"; // 使用cookie存储token

// 获取token
const token = Cookies.get("auth-token");

// 一般用户
interface User {
  nickname: string;
  email: string;
  username: string;
  campus_id: number;
  qq: string;
  credit: number;
}

// 管理员通过QQ号搜索到的用户
interface SearchedUser {
  id: number;
  nickname: string;
  email: string;
  qq_id: string;
  username: string;
  credit: number;
  campus_id: number;
}

// 用户的主题信息
interface UserTheme {
  theme_id: number;
  background: string;
  banner: string;
  avatar: string;
}

interface UserState {
  users: SearchedUser[]; // 管理员测试所有用户
  currentUser: User | null; // 当前用户
  searchedUser: SearchedUser | null; // 管理员通过QQ号搜索到的用户
  userTheme: UserTheme; // 用户的主题信息
  fetchUsers: () => Promise<void>;
  fetchByQQ: (qq: string) => Promise<void>;
  getTheme: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  changeTheme: (theme_id: number) => Promise<void>;
  changeBackground: (background: string) => Promise<void>;
  changeBanner: (banner: string) => Promise<void>;
  changeAvatar: (avatar: string) => Promise<void>;
  changeProfile: (
    nickname: string,
    campus_id: number,
    qq_id: string
  ) => Promise<void>;
  updateCredit: (qq_id: string, credit: number) => Promise<void>;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: [],
      currentUser: null,
      searchedUser: null,
      userTheme: {
        theme_id: 1,
        background: "",
        banner: "",
        avatar: "",
      },
      // 管理员获取所有用户信息
      fetchUsers: async () => {
        try {
          const res = await axios.get("localhost:5000/api/users/");
          set({ users: res.data });
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      // 用户获取自己的信息
      fetchUserProfile: async () => {
        try {
          const res = await axios.get("localhost:5000/api/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set({ currentUser: res.data });
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      // 管理员通过QQ号搜索用户
      fetchByQQ: async (qq: string) => {
        try {
          const res = await axios.post("localhost:5000/api/users/searchByQQ", {
            params: {
              qq_id: qq,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set({ searchedUser: res.data });
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      // 获取用户的所有主题信息
      getTheme: async () => {
        try {
          const res = await axios.get("localhost:5000/api/users/get-theme", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set({ userTheme: res.data });
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      // 更换用户的主题编号
      changeTheme: async (theme_id: number) => {
        try {
          const res = await axios.put("localhost:5000/api/users/change-theme", {
            params: {
              theme_id: theme_id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set((state) => ({
            userTheme: {
              ...state.userTheme, // 保持其他属性不变
              theme_id: theme_id, // 更新 theme_id 属性
            },
          }));
          console.log(res.data);
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      // 更新用户的发布背景
      changeBackground: async (background: string) => {
        try {
          const res = await axios.put("localhost:5000/api/users/change-background", {
            params: {
              background: background,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set((state) => ({
            userTheme: {
              ...state.userTheme, // 保持其他属性不变
              background: background, // 更新 background 属性
            },
          }));
          console.log(res.data);
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      // 更新用户的banner
      changeBanner: async (banner: string) => {
        try {
          const res = await axios.put("localhost:5000/api/users/change-banner", {
            params: {
              banner: banner,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set((state) => ({
            userTheme: {
              ...state.userTheme, // 保持其他属性不变
              banner: banner, // 更新 banner 属性
            },
          }));
          console.log(res.data);
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      // 更新用户的头像
      changeAvatar: async (avatar: string) => {
        try {
          const res = await axios.put("localhost:5000/api/users/change-banner", {
            params: {
              image: avatar,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set((state) => ({
            userTheme: {
              ...state.userTheme, // 保持其他属性不变
              avatar: avatar, // 更新 avatar 属性
            },
          }));
          console.log(res.data);
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      // 更新用户的个人信息
      changeProfile: async (
        nickname: string,
        campus_id: number,
        qq_id: string
      ) => {
        try {
          const res = await axios.put("localhost:5000/api/users/profile", {
            params: {
              nickname: nickname,
              campus_id: campus_id,
              qq_id: qq_id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set(
            (state: UserState) =>
              ({
                currentUser: {
                  ...state.currentUser,
                  nickname: nickname,
                  campus_id: campus_id,
                  qq_id: qq_id,
                },
              } as Partial<UserState>)
          );
          console.log(res.data);
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      // 管理员更新用户信誉分
      updateCredit: async (qq_id: string, credit: number) => {
        try {
          const res = await axios.put("localhost:5000/api/users/searchByQQ", {
            params: {
              qq_id: qq_id,
              credit: credit,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set(
            (state: UserState) =>
              ({
                currentUser: {
                  ...state.currentUser,
                  credit: credit,
                },
              } as Partial<UserState>)
          );
          console.log(res.data);
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
