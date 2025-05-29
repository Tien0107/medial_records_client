import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MedicalRecordABI, MedicalRecordAddress } from '../contractConfig';
import '../App.css';

function HomePage() {
  const [account, setAccount] = useState(null);
  const [records, setRecords] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    diagnosis: '',
  });

  useEffect(() => {
    connectWallet();
  }, []); 

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Vui lòng cài đặt Metamask!');
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Kết nối ví thất bại!");
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
      if (!formData.patientName || !formData.diagnosis) {
        setUploadStatus('Lỗi: Vui lòng điền đầy đủ thông tin');
        return;
      }

      setUploadStatus('Đang tải lên IPFS...');
      
      // Tạo provider và signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MedicalRecordAddress, MedicalRecordABI, signer);

      // TODO: Thêm logic upload lên IPFS ở đây
      const ipfsHash = "QmExample"; // Thay thế bằng hash thực từ IPFS

      // Thêm hồ sơ vào smart contract
      const tx = await contract.addRecord(ipfsHash);
      await tx.wait();

      setUploadStatus('Thêm hồ sơ thành công!');
      // Reset form
      setFormData({
        patientName: '',
        diagnosis: '',
      });
      // Refresh danh sách hồ sơ
      fetchRecords();
    } catch (error) {
      setUploadStatus('Lỗi: ' + error.message);
    }
  };

  const fetchRecords = async () => {
    try {
      setUploadStatus('Đang tải danh sách hồ sơ...');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MedicalRecordAddress, MedicalRecordABI, signer);

      // Lấy hồ sơ của bệnh nhân hiện tại
      const [hashes, timestamps] = await contract.viewRecords(account);
      
      // TODO: Thêm logic lấy dữ liệu từ IPFS ở đây
      const recordsData = hashes.map((hash, index) => ({
        ipfsHash: hash,
        timestamp: new Date(Number(timestamps[index]) * 1000).toLocaleString(),
        // Thêm các thông tin khác từ IPFS
      }));

      setRecords(recordsData);
      setUploadStatus('');
    } catch (error) {
      setUploadStatus('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Hệ thống Quản lý Hồ sơ Bệnh án</h1>
        <br />
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Kết nối Metamask
          </button>
        ) : (
          <div>
            <p className="mb-4 text-black">Tài khoản: {account}</p>

            <div className="bg-green-50 p-8 rounded-xl shadow-2xl max-w-md mx-auto mt-10">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Thông tin Hồ sơ</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-gray-800 mb-1">Tên Bệnh nhân</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-800 mb-1">Chẩn đoán</label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800"
                    rows="3"
                  />
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={handleAddRecord}
                    className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Thêm Hồ sơ
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

            {records.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Danh sách Hồ sơ</h3>
                <div className="space-y-4">
                  {records.map((record, index) => (
                    <div key={index} className="bg-white p-4 rounded shadow">
                      <p><strong>Thời gian:</strong> {record.timestamp}</p>
                      <p className="text-sm text-gray-500">
                        <strong>IPFS Hash:</strong> {record.ipfsHash}
                      </p>
                      <a 
                        href={`https://ipfs.io/ipfs/${record.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Xem trên IPFS
                      </a>
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

export default HomePage;
