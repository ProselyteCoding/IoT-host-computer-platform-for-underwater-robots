import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import "./forget.scss";
import logo from "../../assets/logo.png";
import background from "../../assets/background1.jpg";

type VerificationInputs = {
  email: string;
  verification: string;
  password: string;
  confirmPassword: string; // 增加确认密码字段
};

type ErrorType = {
  message: string;
};

const Forget: React.FC = () => {
  const [inputs, setInputs] = useState<VerificationInputs>({
    email: "",
    verification: "",
    password: "",
    confirmPassword: "", // 初始化确认密码字段
  });

  const [error, setError] = useState<ErrorType | null>(null);

  const [countdown, setCountdown] = useState<number>(0);

  const navigate = useNavigate();
  const { requestVerification, changePassword, isAuthenticated } =
    useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequest = async () => {
    if (countdown > 0) return; // 倒计时中则不发送请求

    try {
      await requestVerification(inputs.email);
      setCountdown(300); // 设置5分钟倒计时
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
      }, 300000); // 5分钟后清除倒计时
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError({ message: "发送验证码失败，请稍后重试" });
      }
    }
  };

  const validatePasswords = () => {
    if (inputs.password !== inputs.confirmPassword) {
      setError({ message: "两次输入的密码不一致" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 检查密码是否一致
    if (!validatePasswords()) {
      setError({ message: "两次输入的密码不一致" });
      return;
    }

    // 检查密码是否符合要求
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}/.test(inputs.password)) {
      setError({
        message: "密码不符合要求",
      });
      return;
    }

    try {
      await changePassword(inputs.email, inputs.verification, inputs.password);
      navigate("/market");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError({ message: "发生未知错误" });
      }
    }
  };

  return (
    <div className="forget-container">
      <div className="forget-box">
        <div className="forget-title">重置密码</div>
        <form className="forget-form" onSubmit={handleSubmit}>
          <div className="form-item">
            <label htmlFor="email">账户邮箱:</label>
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
            <label htmlFor="verification">验证码:</label>
            <div className="verification-container">
              <input
                required
                type="text"
                name="verification"
                id="verification"
                value={inputs.verification}
                onChange={handleChange}
              />
              {countdown > 0 ? (
                <button className="verification-disabled-btn" disabled>
                  {Math.ceil(countdown)}秒后再试
                </button>
              ) : (
                <button className="verification-btn" onClick={handleRequest}>
                  获取验证码
                </button>
              )}
            </div>
          </div>
          <div className="form-item">
            <label htmlFor="password" style={{ height: "40px" }}>
              新密码（至少含1个大写字母、1个数字，长度至少为8位）:
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
            <label htmlFor="confirmPassword">确认密码:</label>
            <input
              required
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={inputs.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="reset-btn">
            重置密码
          </button>
          {error && <div className="error-message">{error.message}</div>}
          <div className="forget-link">
            {isAuthenticated ? (
              <Link className="link" to="/user/settings">
                返回设置
              </Link>
            ) : (
              <Link className="link" to="/login">
                立即登录！
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forget;
