import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import Cookies from "js-cookie"; // 使用cookie存储token

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (userData: {
    nickname?: string;
    email: string;
    password: string;
    username: string;
  }) => Promise<void>;
  logout: () => void;
  deleteUser: (username: string) => Promise<void>;
  requestVerification: (email: string) => Promise<void>;
  changePassword: (
    email: string,
    verificationCode: string,
    newPassword: string
  ) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      isAdmin: false,
      login: async (identifier: string, password: string) => {
        try {
          const res = await axios.post(
            "http://localhost:5000/api/auth/login",
            { identifier, password }
          );
          const token = res.data.token;
          const isAdmin = res.data.isAdmin;
          Cookies.set("auth-token", token, { expires: 7 });
          set({ isAuthenticated: true, token, isAdmin });
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      register: async (userData: {
        nickname?: string;
        email: string;
        password: string;
        username: string;
      }) => {
        try {
          const res = await axios.post(
            "http://localhost:5000/api/auth/register",
            userData
          );
          console.log(res.data.message); // 注册成功
        } catch (error: any) {
          //console.log(userData);
          if (error.response) console.error(error.response.data.message); // 注册失败
        }
      },
      logout: () => {
        Cookies.remove("auth-token"); // 登出时移除 cookie
        set({ isAuthenticated: false, token: null });
      },
      deleteUser: async (username: string) => {
        try {
          const res = await axios.delete(
            "http://localhost:5000/api/users/profile",
            { data: { username } }
          );
          console.log(res.data.message); // 账户已删除
          Cookies.remove("auth-token"); // 删除用户时移除 cookie
          set({ isAuthenticated: false, token: null });
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      requestVerification: async (email: string) => {
        try {
          const res = await axios.post(
            "http://localhost:5000/api/users/RequestVerification",
            { email }
          );
          if (res.status === 200) {
            console.log(res.data.message); // 验证码已发送，请检查您的邮箱
          }
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
      changePassword: async (
        email: string,
        verificationCode: string,
        newPassword: string
      ) => {
        try {
          const res = await axios.put(
            "http://localhost:5000/api/users/change-password",
            { email, verificationCode, newPassword }
          );
          if (res.status === 200) {
            console.log(res.data.message); // 密码修改成功
          }
        } catch (error: any) {
          if (error.response) console.error(error.response.data.message);
        }
      },
    }),
    {
      name: "auth-storage", // 唯一名称
    }
  )
);

export default useAuthStore;
