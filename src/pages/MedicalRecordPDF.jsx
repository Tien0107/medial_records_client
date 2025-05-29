import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useLocation, useNavigate } from 'react-router-dom';

// Tạo styles cho PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

// Component PDF Document
const MedicalRecordDocument = ({ patientData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>BỆNH ÁN</Text>
        <Text style={styles.subtitle}>Thông tin bệnh nhân:</Text>
        <Text style={styles.text}>Họ tên: {patientData.name}</Text>
        <Text style={styles.text}>Thời gian khám: {patientData.timestamp}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Chẩn đoán:</Text>
        <Text style={styles.text}>{patientData.diagnosis}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Điều trị:</Text>
        <Text style={styles.text}>{patientData.treatment}</Text>
      </View>
    </Page>
  </Document>
);

// Component chính
const MedicalRecordPDF = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientData } = location.state || {};

  if (!patientData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">Không tìm thấy dữ liệu bệnh án</p>
        <button
          onClick={() => navigate('/patient-view')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white p-4 shadow-md">
        <button
          onClick={() => navigate('/patient-view')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          <MedicalRecordDocument patientData={patientData} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default MedicalRecordPDF; 