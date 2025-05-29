import React, { useState } from "react";
import "./login_register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const connectWalletAndLogin = async () => {
    try {
      setLoading(true);

      if (!window.ethereum) {
        alert("Bạn cần cài MetaMask trước!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const wallet = accounts[0];

      // Gửi request login lên backend
      const response = await axios.post("https://backend-medical-record.onrender.com/api/v1/auth/sign-in", {
        wallet,
      });

      if (response.data.status === "success") {
        const token = response.data.data.token;
        localStorage.setItem("access_token", token); // hoặc sessionStorage tuỳ app
        navigate("/home");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 p-4 rounded-xl shadow-md" onSubmit={(e) => e.preventDefault()}>
      <div className="form-container">
        <div className="form">
          <span className="heading">Đăng Nhập</span>

          <span className="c2">Kết nối MetaMask để đăng nhập!</span>

          <div className="button-container">
            <div className="send-button" onClick={connectWalletAndLogin}>
              {loading ? "Đang đăng nhập..." : "Login with MetaMask"}
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
