import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import { useUserStore } from "../../store";
import "./login.scss";
import background from "../../assets/loginBackground.jpg";


type LoginInputs = {
  identifier: string;
  password: string;
};

type ErrorType = {
  message: string;
};

const Login: React.FC = () => {
  // 输入的用户信息
  const [inputs, setInputs] = useState<LoginInputs>({
    identifier: "",
    password: "",
  });

  // 错误信息
  const [error, setError] = useState<ErrorType | null>(null);

  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { fetchUserProfile, getTheme } = useUserStore();

  // 设置用户信息
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(inputs.identifier, inputs.password); // 调用 login 方法
      await fetchUserProfile(); // 调用 fetchUserProfile 方法，设置 currentUser
      await getTheme(); // 调用 getTheme 方法，设置 userTheme
      navigate("/user/market");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError({ message: "登录错误" });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="background" style={{ backgroundImage: `url(${background})` }}></div>
      <div className="content">
        <div className="unlogin-box">
          <div className="unlogin-title">Welcome Back!</div>
          <div className="unlogin-text">歪歪歪，你没有账户或者忘记密码啦？点击下方注册或找回！</div>
          <div className="register" onClick={()=>{navigate("/register")}}>
            注册账号
          </div>
          <div className="forget" onClick={()=>{navigate("/forget")}}>
            找回密码
          </div>
        </div>
        <div className="login-box">
          <div className="login-title">立即登录</div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-item">
              <label htmlFor="identifier">用户名或邮箱:</label>
              <input
                required
                type="text"
                name="identifier"
                id="identifier"
                value={inputs.identifier}
                onChange={handleChange}
              />
            </div>
            <div className="form-item">
              <label htmlFor="password">密码:</label>
              <input
                required
                type="password"
                name="password"
                id="password"
                value={inputs.password}
                onChange={handleChange}
              />
            </div>
              <button type="submit" >登录</button>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
