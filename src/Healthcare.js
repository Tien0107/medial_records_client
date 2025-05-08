import Web3 from 'web3';
import { MedicalRecordABI, MedicalRecordAddress } from './contractConfig';

class Healthcare {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
    this.uploadUrl = 'https://backend-medical-record.onrender.com/api/v1/upload';
  }

  async init() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0];
      this.contract = new this.web3.eth.Contract(MedicalRecordABI, MedicalRecordAddress);
      return true;
    }
    return false;
  }

  async addRecord(patientID, patientName, diagnosis, treatment) {
    try {
      await this.contract.methods.addRecord(patientID, patientName, diagnosis, treatment)
        .send({ from: this.account });
      return true;
    } catch (error) {
      console.error('Lỗi khi thêm hồ sơ:', error);
      return false;
    }
  }

  async uploadRecord(patientID, patientName, diagnosis, treatment) {
    try {
      const response = await fetch(this.uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientID,
          patientName,
          diagnosis,
          treatment,
          patientAddress: this.account
        })
      });

      if (!response.ok) {
        throw new Error('Lỗi khi tải lên');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi tải lên:', error);
      throw error;
    }
  }

  async getPatientRecords(patientID) {
    try {
      const records = await this.contract.methods.getPatientRecords(patientID)
        .call({ from: this.account });
      return records;
    } catch (error) {
      console.error('Lỗi khi lấy hồ sơ:', error);
      return [];
    }
  }

  async authorizeProvider(providerAddress) {
    try {
      await this.contract.methods.authorizeProvider(providerAddress)
        .send({ from: this.account });
      return true;
    } catch (error) {
      console.error('Lỗi khi cấp quyền:', error);
      return false;
    }
  }

  getAccount() {
    return this.account;
  }
}

export default new Healthcare(); 