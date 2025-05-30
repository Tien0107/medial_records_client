import React, { useState, useEffect } from "react";
import "./login_register.css";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { MedicalRecordABI, MedicalRecordAddress } from "../contractConfig";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    if (token && role) {
      navigate(role === "doctor" ? "/doctor" : "/home");
    }
  }, [navigate]);

  const connectWalletAndLogin = async () => {
    try {
      setLoading(true);

      if (!window.ethereum) {
        alert("Bạn cần cài MetaMask trước!");
        return;
      }

      // Kết nối với MetaMask
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const wallet = accounts[0];
      setWalletAddress(wallet);

      // Kiểm tra đăng ký trên smart contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MedicalRecordAddress, MedicalRecordABI, signer);

      const isPatient = await contract.isPatient(wallet);
      const isDoctor = await contract.isDoctor(wallet);

      if (!isPatient && !isDoctor) {
        alert("Ví của bạn chưa được đăng ký. Vui lòng đăng ký trước!");
        navigate("/register");
        return;
      }

      // Tạo URLSearchParams object
      const formData = new URLSearchParams();
      formData.append('wallet', wallet);

      // Gửi request login lên backend
      const response = await fetch("https://backend-medical-record.onrender.com/api/v1/auth/sign-in", {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: formData.toString()
      });

      const data = await response.json();

      if (data.status === "success") {
        const { token, role } = data.data;
        localStorage.setItem("access_token", token);
        localStorage.setItem("user_role", role);
        localStorage.setItem("wallet_address", wallet);

        // Chuyển hướng dựa vào role
        navigate(role === "doctor" ? "/doctor" : "/home");
      } else {
        alert(data.message || "Đăng nhập thất bại!");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form">
        <span className="heading">Đăng Nhập</span>
        <span className="c2">
          {walletAddress 
            ? `Đã kết nối: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
            : "Kết nối MetaMask để đăng nhập!"}
        </span>

        <div className="button-container">
          <button 
            className="send-button" 
            onClick={connectWalletAndLogin}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : walletAddress ? "Đăng Nhập" : "Kết Nối Ví"}
          </button>
          <div className="reset-button-container">
            <button
              className="reset-button"
              onClick={() => navigate("/register")}
            >
              Đăng Ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
