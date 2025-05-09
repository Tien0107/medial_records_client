import React from "react";
import "./login.css";
import RegisterPage from "./register";
// import { useNavigate } from "react-router-dom";

const HomePage = () => {
    // const navigate = useNavigate();

  return (
    <form className="space-y-4 p-4 bg-white rounded-xl shadow-md">
        <div class="form-container">
            <div class="form">
                <span class="heading">HỆ THỐNG QUẢN LÝ HỒ SƠ BỆNH ÁN</span>
                <span class="c2">Đăng Nhập Và Quản Lý Hồ Sơ Của Bạn!</span>
                <div class="button-container">
                <div class="send-button">Login</div>
                <div class="reset-button-container">
                <div class="reset-button" id="reset-btn">Register </div>
    
      </div>
      
    </div>
  </div>
</div>
    </form>
  );
};

export default HomePage;
