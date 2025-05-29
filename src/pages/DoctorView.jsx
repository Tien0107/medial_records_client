import React, { useState } from 'react';
import { ethers } from 'ethers';
import { MedicalRecordABI, MedicalRecordAddress } from '../contractConfig';
import '../App.css';

const DoctorView = () => {
  const [patientAddress, setPatientAddress] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grantStatus, setGrantStatus] = useState('');
  const [viewStatus, setViewStatus] = useState('');

  const handleGrantAccess = async () => {
    setGrantStatus('');
    try {
      if (!window.ethereum) {
        alert('Vui lòng cài đặt Metamask!');
        return;
      }
      if (!patientAddress) {
        setGrantStatus('Vui lòng nhập địa chỉ ví bệnh nhân');
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MedicalRecordAddress, MedicalRecordABI, signer);
      const tx = await contract.grant(patientAddress);
      await tx.wait();
      setGrantStatus('Cấp quyền thành công!');
    } catch (error) {
      setGrantStatus('Lỗi: ' + error.message);
    }
  };

  const handleViewRecords = async () => {
    setViewStatus('');
    setLoading(true);
    try {
      if (!window.ethereum) {
        alert('Vui lòng cài đặt Metamask!');
        return;
      }
      if (!patientAddress) {
        setViewStatus('Vui lòng nhập địa chỉ ví bệnh nhân');
        setLoading(false);
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MedicalRecordAddress, MedicalRecordABI, signer);
      const [hashes, timestamps] = await contract.viewRecords(patientAddress);
      const recordsData = hashes.map((hash, index) => ({
        ipfsHash: hash,
        timestamp: new Date(Number(timestamps[index]) * 1000).toLocaleString(),
      }));
      setRecords(recordsData);
    } catch (error) {
      setViewStatus('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Trang Bác sĩ - Quản lý Hồ sơ Bệnh án</h1>
        <div className="flex gap-4 mb-4 justify-center">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            onClick={() => window.open('https://react-tsx-export-pdf.vercel.app', '_blank')}
          >
            Xuất file bệnh án
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              localStorage.clear();
              if (window.ethereum && window.ethereum.selectedAddress) {
                // Một số wallet hỗ trợ phương thức này, nhưng MetaMask không hỗ trợ disconnect qua JS
                // window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
              }
              window.location.href = "/";
            }}
          >
            Đăng xuất
          </button>
        </div>
        <div className="bg-green-50 p-8 rounded-xl shadow-2xl max-w-md mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Bệnh nhân</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nhập địa chỉ ví bệnh nhân"
              value={patientAddress}
              onChange={e => setPatientAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800"
            />
            <button
              onClick={handleGrantAccess}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Xác nhận Grant
            </button>
            {grantStatus && (
              <p className={`mt-2 text-center ${grantStatus.includes('Lỗi') ? 'text-red-600' : 'text-green-600'}`}>{grantStatus}</p>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Hồ sơ bệnh nhân</h2>
          <div className="space-y-4">
            <button
              onClick={handleViewRecords}
              className="w-full bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition"
              disabled={loading}
            >
              {loading ? 'Đang tải...' : 'Xem Hồ sơ'}
            </button>
            {viewStatus && (
              <p className={`mt-2 text-center ${viewStatus.includes('Lỗi') ? 'text-red-600' : 'text-green-600'}`}>{viewStatus}</p>
            )}
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
        </div>
      </div>
    </div>
  );
};

export default DoctorView; 