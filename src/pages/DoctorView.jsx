import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MedicalRecordABI, MedicalRecordAddress } from '../contractConfig';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const contractAddress = MedicalRecordAddress;

  useEffect(() => {
    loadGrantedPatients();
  }, []);

  const loadGrantedPatients = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MedicalRecordABI, signer);
      
      const grantedDoctors = await contract.getGrantedDoctors();
      setPatients(grantedDoctors);
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };

  const viewPatientRecords = async (patientAddress) => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MedicalRecordABI, signer);
      
      const [hashes, timestamps] = await contract.viewRecords(patientAddress);
      const recordsData = hashes.map((hash, index) => ({
        ipfsHash: hash,
        timestamp: new Date(timestamps[index] * 1000).toLocaleString()
      }));
      
      setRecords(recordsData);
    } catch (error) {
      console.error("Error viewing records:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = (record) => {
    // Implement PDF export logic here
    window.open(`https://ipfs.io/ipfs/${record.ipfsHash}`, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient List */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Granted Patients</h2>
          <div className="space-y-2">
            {patients.map((patient, index) => (
              <div 
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => viewPatientRecords(patient)}
              >
                {patient.substring(0, 6)}...{patient.substring(38)}
              </div>
            ))}
          </div>
        </div>

        {/* Records Display */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Patient Records</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4">
              {records.map((record, index) => (
                <div key={index} className="border p-3 rounded">
                  <p>Date: {record.timestamp}</p>
                  <button
                    onClick={() => exportToPDF(record)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View Record
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 