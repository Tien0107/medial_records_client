import React from "react";
import "./login_register.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <form className="space-y-4 p-4 rounded-xl shadow-md">
      <div className="form-container">
        <div className="form">
          <span className="heading">Đăng Nhập</span>
          <input className="input" type="text" placeholder="Tài Khoản" />
          <input className="input" type="password" placeholder="Password" />

          <span className="c2">Đăng Nhập Và Quản Lý Hồ Sơ Của Bạn!</span>

          <div className="button-container">
            <div
              className="send-button"
              onClick={() => navigate("/home")}
            >
              Login
            </div>
            <div className="reset-button-container">
              <div
                className="reset-button"
                id="reset-btn"
                onClick={() => navigate("/register")}
              >
                Register
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
