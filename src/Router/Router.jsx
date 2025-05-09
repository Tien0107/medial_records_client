import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Nếu bạn có trang đăng ký
import Healthcare from './components/Healthcare'; // Ví dụ nếu có component Healthcare

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/healthcare" element={<Healthcare />} /> */}
        {/* Thêm các Route khác nếu cần */}
      </Routes>
    </Router>
  );
};

export default RouterComponent;
