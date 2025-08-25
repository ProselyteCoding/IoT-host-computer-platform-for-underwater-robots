import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import "./register.scss";
import logo from "../../assets/logo.png";
import background from "../../assets/background1.jpg";

type RegisterInputs = {
  nickname?: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
};

type ErrorType = {
  message: string;
};

const Register: React.FC = () => {
  // 输入的用户信息
  const [inputs, setInputs] = useState<RegisterInputs>({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  // 错误信息
  const [error, setError] = useState<ErrorType | null>(null);

  const navigate = useNavigate();
  const { register } = useAuthStore();

  // 设置用户信息
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 检查密码是否一致
      if (inputs.password !== inputs.confirmPassword) {
        setError({ message: "密码不一致" });
        return;
      }

      // 格式验证
      if (!/\S+@\S+\.\S+/.test(inputs.email)) {
        setError({ message: "请输入有效的邮箱地址" });
        return;
      }
      if (!/^[a-zA-Z0-9_]{3,16}$/.test(inputs.username)) {
        setError({ message: "用户名不符合要求" });
        return;
      }
      if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}/.test(inputs.password)
      ) {
        setError({
          message:
            "密码不符合要求",
        });
        return;
      }

      // 提交给注册方法的用户数据
      const userData = {
        nickname: inputs.nickname,
        email: inputs.email,
        password: inputs.password,
        username: inputs.username,
      };

      await register(userData);
      navigate("/login");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError({ message: "发生未知错误" });
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-title">注册账号</div>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-item">
            <label htmlFor="nickname">昵称（用于应用内展示）</label>
            <input
              required
              type="text"
              name="nickname"
              id="nickname"
              value={inputs.nickname}
              onChange={handleChange}
            />
          </div>
          <div className="form-item">
            <label htmlFor="email">邮箱（用于登录及账号操作）</label>
            <input
              required
              type="text"
              name="email"
              id="email"
              value={inputs.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-item">
            <label htmlFor="username" style={{ height: "40px" }}>
              用户名（用于登录，3~16位字母、数字或下划线）
            </label>
            <input
              required
              type="text"
              name="username"
              id="username"
              value={inputs.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-item">
            <label htmlFor="password" style={{ height: "40px" }}>
              密码（至少含1个大写字母、1个数字，长度至少为8位）
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              value={inputs.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-item">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              required
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={inputs.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit">注册</button>
          {error ? (
            <div className="error-message">{error.message}</div>
          ) : (
            <div className="link">
              <Link to="/login">立即登录！</Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
