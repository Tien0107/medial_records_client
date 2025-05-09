import React from "react";
import "./login.css";

const RegisterPage = () => {
  return (
    <form className="space-y-4 p-4 bg-white rounded-xl shadow-md">
        <div class="form-container">
            <div class="form">
                <span class="heading">Register</span>
                <input class="input" type="text" placeholder="Họ" />
                <input class="input" type="text" placeholder="Tên" />
                <input class="input" type="text" placeholder="Ngày Tháng Năm Sinh" />
                <input class="input" type="text" placeholder="Tên Tài Khoản" />
                <input class="input" type="text" placeholder="Mât Khẩu" />
                <input class="input" type="text" placeholder="Xác Nhận Mật Khẩu" />
                <input class="input" type="text" placeholder="Số điện thoại" />
                <input class="input" type="text" placeholder="Kết Nối Ví Điện Tử" />
                <span class="c2">Đăng Ký Và Quản Lý Hồ Sơ Của Bạn!</span>
                <div class="button-container">
                <div class="send-button">Register</div>
                <div class="reset-button-container">
                <div class="reset-button" id="reset-btn">Login</div>
      </div>
    </div>
  </div>
</div>
    </form>
  );
};

export default RegisterPage;
