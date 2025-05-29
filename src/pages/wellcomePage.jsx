import React from "react";
import "./login_register.css";
import { useNavigate } from "react-router-dom";
import "./login.jsx";
import "./register.jsx";

const WellcomePage = () => {
  const navigate = useNavigate();

  const goToLogin = () => navigate("/login");
  const goToRegister = () => navigate("/register");

  return (
    <form className="space-y-4 p-4 bg-white rounded-xl shadow-md">
      <div className="form-container">
        <div className="form">
          <span className="heading">HỆ THỐNG QUẢN LÝ HỒ SƠ BỆNH ÁN</span>
          <span className="c2">Đăng Nhập Và Quản Lý Hồ Sơ Của Bạn!</span>
          <div className="button-container">
            <div className="send-button" onClick={goToLogin}>
              Truy cập
            </div>
            <div className="reset-button-container">
              <div className="reset-button" id="reset-btn" onClick={goToRegister}>
                Register
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default WellcomePage; ;
