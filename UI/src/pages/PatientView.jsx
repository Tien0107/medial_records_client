import React from 'react';
import PropTypes from 'prop-types'; // 👈 Import nè
import { useNavigate } from 'react-router-dom';

function PatientView({ formData, records, handleInputChange, fetchRecords }) {
  const navigate = useNavigate();

  const handleExportPDF = (record) => {
    // Chuyển hướng đến trang PDF với dữ liệu bệnh án
    navigate('/medical-record-pdf', { 
      state: { 
        patientData: {
          name: record.patientName,
          diagnosis: record.diagnosis,
          treatment: record.treatment,
          timestamp: new Date(record.timestamp * 1000).toLocaleString(),
        }
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Xem Hồ sơ Bệnh nhân</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">ID Bệnh nhân</label>
        <input
          type="text"
          name="patientID"
          value={formData.patientID}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
        />
      </div>
      <button
        onClick={fetchRecords}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Xem Hồ sơ
      </button>

      {records.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Danh sách Hồ sơ</h3>
          <div className="space-y-4">
            {records.map((record, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded shadow">
                <p><strong>Tên:</strong> {record.patientName}</p>
                <p><strong>Chẩn đoán:</strong> {record.diagnosis}</p>
                <p><strong>Điều trị:</strong> {record.treatment}</p>
                <p><strong>Thời gian:</strong> {new Date(record.timestamp * 1000).toLocaleString()}</p>
                <button
                  onClick={() => handleExportPDF(record)}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Xuất PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

PatientView.propTypes = {
  formData: PropTypes.shape({
    patientID: PropTypes.string.isRequired,
  }).isRequired,
  records: PropTypes.arrayOf(
    PropTypes.shape({
      patientName: PropTypes.string.isRequired,
      diagnosis: PropTypes.string.isRequired,
      treatment: PropTypes.string.isRequired,
      timestamp: PropTypes.number.isRequired,
    })
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  fetchRecords: PropTypes.func.isRequired,
};

export default PatientView;
