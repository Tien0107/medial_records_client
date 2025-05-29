import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from '../pages/wellcomePage';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register'; // Nếu bạn có trang đăng ký
import HomePage from '../pages/HomePage';
import PatientView from '../pages/PatientView';
import DoctorView from '../pages/DoctorView';


const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/patient-view" element={<PatientView />} />
        <Route path="/doctor" element={<DoctorView />} />

        {/* Thêm các Route khác nếu cần */}
      </Routes>
    </Router>
  );
};

export default RouterComponent;
