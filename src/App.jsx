import React, { useState, useEffect } from 'react';
import Healthcare from './Healthcare';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [records, setRecords] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [formData, setFormData] = useState({
    patientID: '',
    patientName: '',
    diagnosis: '',
    treatment: ''
  });

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    const success = await Healthcare.init();
    if (success) {
      setAccount(Healthcare.getAccount());
    } else {
      alert('Vui lòng cài đặt Metamask!');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddRecord = async () => {
    try {
      await Healthcare.addRecord(
        formData.patientID,
        formData.patientName,
        formData.diagnosis,
        formData.treatment
      );
      alert('Thêm hồ sơ thành công!');
      fetchRecords();
    } catch (error) {
      alert('Lỗi khi thêm hồ sơ: ' + error.message);
    }
  };

  const handleUploadRecord = async () => {
    try {
      setUploadStatus('Đang tải lên...');
      await Healthcare.uploadRecord(
        formData.patientID,
        formData.patientName,
        formData.diagnosis,
        formData.treatment
      );
      setUploadStatus('Tải lên thành công!');
    } catch (error) {
      setUploadStatus('Lỗi: ' + error.message);
    }
  };

  const fetchRecords = async () => {
    if (formData.patientID) {
      const patientRecords = await Healthcare.getPatientRecords(formData.patientID);
      setRecords(patientRecords);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hệ thống Quản lý Hồ sơ Bệnh án</h1>
        
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Kết nối Metamask
          </button>
        ) : (
          <div>
            <p className="mb-4">Tài khoản: {account}</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Vai trò</label>
              <select
                onChange={(e) => setIsDoctor(e.target.value === 'doctor')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="patient">Bệnh nhân</option>
                <option value="doctor">Bác sĩ</option>
              </select>
            </div>

            {isDoctor ? (
              <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-md mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Chức năng Bác sĩ</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">ID Bệnh nhân cần xem</label>
                    <input
                      type="text"
                      name="patientID"
                      value={formData.patientID}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <button
                    onClick={fetchRecords}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Xem Hồ sơ Bệnh nhân
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-md mx-auto mt-10">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Thông tin Hồ sơ</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">ID Bệnh nhân</label>
                    <input
                      type="text"
                      name="patientID"
                      value={formData.patientID}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">Tên Bệnh nhân</label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">Chẩn đoán</label>
                    <textarea
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">Điều trị</label>
                    <textarea
                      name="treatment"
                      value={formData.treatment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows="3"
                    />
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <button
                      onClick={handleAddRecord}
                      className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Thêm Hồ sơ
                    </button>
                    <button
                      onClick={handleUploadRecord}
                      className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Sửa Hồ sơ
                    </button>
                    <button
                      onClick={fetchRecords}
                      className="w-full bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                      Xem Hồ sơ
                    </button>
                  </div>
                  {uploadStatus && (
                    <p className={`mt-2 text-center ${uploadStatus.includes('Lỗi') ? 'text-red-600' : 'text-green-600'}`}>{uploadStatus}</p>
                  )}
                </div>
              </div>
            )}

            {records.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Danh sách Hồ sơ</h3>
                <div className="space-y-4">
                  {records.map((record, index) => (
                    <div key={index} className="bg-white p-4 rounded shadow">
                      <p><strong>ID:</strong> {record.recordID}</p>
                      <p><strong>Tên:</strong> {record.patientName}</p>
                      <p><strong>Chẩn đoán:</strong> {record.diagnosis}</p>
                      <p><strong>Điều trị:</strong> {record.treatment}</p>
                      <p><strong>Thời gian:</strong> {new Date(record.timestamp * 1000).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
