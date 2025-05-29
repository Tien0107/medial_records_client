import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from '../pages/wellcomePage';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register'; // Nếu bạn có trang đăng ký
import HomePage from '../pages/HomePage';
import PatientView from '../pages/PatientView';
import MedicalRecordPDF from '../pages/MedicalRecordPDF';

// Component để kiểm tra role và chuyển hướng
const DoctorRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole'); // Giả sử role được lưu trong localStorage
  if (userRole === 'doctor') {
    return <Navigate to="https://react-tsx-export-pdf.vercel.app" replace />;
  }
  return children;
};

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={
          <DoctorRoute>
            <HomePage />
          </DoctorRoute>
        } />
        <Route path="/patient-view" element={<PatientView />} />
        <Route path="/medical-record-pdf" element={<MedicalRecordPDF />} />

        {/* <Route path="/healthcare" element={<Healthcare />} /> */}
        {/* Thêm các Route khác nếu cần */}
      </Routes>
    </Router>
  );
};

export default RouterComponent;
