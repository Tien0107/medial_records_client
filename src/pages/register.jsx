import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login_register.css";
import { ethers } from "ethers";
import { MedicalRecordABI, MedicalRecordAddress } from "../contractConfig";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationalId: "",
    role: "patient",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Bạn cần cài MetaMask trước!");
        return;
      }

      // Kết nối với MetaMask
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const wallet = accounts[0];
      setFormData(prev => ({ ...prev, wallet }));
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Kết nối ví thất bại!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.wallet) {
        alert("Vui lòng kết nối ví trước!");
        return;
      }

      // Kết nối với smart contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MedicalRecordAddress, MedicalRecordABI, signer);

      try {
        // Đăng ký trên smart contract
        if (formData.role === "patient") {
          await contract.registerAsPatient();
        } else {
          await contract.registerAsDoctor();
        }
      } catch (error) {
        // Nếu lỗi là đã đăng ký thì bỏ qua, tiếp tục đăng ký backend
        if (
          error.reason !== "This account already registered" &&
          !String(error.message).includes("already registered")
        ) {
          setMessage("Đăng ký thất bại: " + error.message);
          setLoading(false);
          return;
        }
      }

      // Tạo URLSearchParams object
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('wallet', formData.wallet);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('nationalId', formData.nationalId);
      formDataToSend.append('role', formData.role);

      // Đăng ký trên backend
      const response = await fetch("https://backend-medical-record.onrender.com/api/v1/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: formDataToSend.toString()
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.data && data.data.fullName) {
          localStorage.setItem("fullName", data.data.fullName);
        }
        setMessage("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage("Đăng ký thất bại: " + error.message);
    } finally {
      setLoading(false);
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
            name="nationalId"
            placeholder="Số Chứng Minh Nhân Dân"
            value={formData.nationalId}
            onChange={handleChange}
          />
          <select
            className="input"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          
          <div className="button-container">
            <button 
              type="button" 
              className="send-button"
              onClick={connectWallet}
            >
              {formData.wallet ? "Đã kết nối ví" : "Kết nối ví"}
            </button>
          </div>

          <span className="c2">Đăng Ký Và Quản Lý Hồ Sơ Của Bạn!</span>
          
          <div className="button-container">
            <button 
              type="submit" 
              className="send-button"
              disabled={loading}
            >
              {loading ? "Đang đăng ký..." : "Register"}
            </button>
            <div className="reset-button-container">
              <button
                type="button"
                className="reset-button"
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