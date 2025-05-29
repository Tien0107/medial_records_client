import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login_register.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    wallet: "",
    fullName: "",
    email: "",
    phone: "",
    nationalId: "",
    role: "patient", // Mặc định là "patient"
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      wallet: formData.wallet,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      nationalId: formData.nationalId,
      role: formData.role,
    };

    try {
      const response = await fetch("https://backend-medical-record.onrender.com/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        setTimeout(() => navigate("/login"), 2000); // Chuyển hướng sau 2s
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="form-container">
      <div className="form">
        <span className="heading">Register</span>
        <form className="space-y-4 p-4 rounded-xl shadow-md" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            name="fullName"
            placeholder="Họ và Tên"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            className="input"
            type="text"
            name="wallet"
            placeholder="Kết Nối Ví Điện Tử"
            value={formData.wallet}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="text"
            name="nationalId"
            placeholder="Số Chứng Minh Nhân Dân"
            value={formData.nationalId}
            onChange={handleChange}
          />
          <select
            className="input"
            name="role"
            placeholder="Vai Trò"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          <span className="c2">Đăng Ký Và Quản Lý Hồ Sơ Của Bạn!</span>
          <div className="button-container">
            <button type="submit" className="send-button">
              Register
            </button>
            <div className="reset-button-container">
              <button
                type="button"
                className="reset-button"
                id="reset-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>
          {message && <p className="text-center text-red-500">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;