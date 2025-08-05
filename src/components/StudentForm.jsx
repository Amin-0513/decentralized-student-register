// src/components/StudentForm.jsx

import React, { useState, useEffect } from 'react';
import './StudentForm.css';
import { ethers } from 'ethers'; // Ethers v6
import abi from './abi.json';

const contractAddress = '0xDD69c0964d081e7f580Fbe08a365F22e772f448b'; // Replace with your contract address

const StudentForm = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    age: '',
    cnic: '',
  });

  const [walletAddress, setWalletAddress] = useState(null);
  const [contractBalance, setContractBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Please install MetaMask.');
        return;
      }

      setLoading(true);

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.registerStudent(
        formData.studentName,
        formData.fatherName,
        parseInt(formData.age),
        formData.cnic,
        {
          value: ethers.parseEther("1.0"), // 1 ETH
        }
      );

      await tx.wait();
      alert("Registered successfully on the blockchain!");
      setFormData({
        studentName: '',
        fatherName: '',
        age: '',
        cnic: '',
      });

      fetchContractBalance(); // Refresh balance after registration

    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        console.log('Connected wallet:', accounts[0]);
      } catch (error) {
        console.error('Wallet connection error:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const fetchContractBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(contractAddress);
      setContractBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error('Failed to fetch contract balance:', err);
    }
  };

  useEffect(() => {
    connectWallet();
    fetchContractBalance();
  }, []);

  return (
    <div className="container">
      <h2>Register as a Student</h2>
      <p>
        Join our blockchain-powered educational platform. Your registration is
        secure, transparent, and permanently recorded on the Ethereum blockchain.
      </p>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Student Registration</h3>
          <span>Register on the blockchain platform</span>
          <h5>
            {walletAddress ? `Connected wallet: ${walletAddress}` : 'Wallet not connected'}
          </h5>
        </div>

        <label>
           Student Name
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </label>

        <label>
          Father's Name
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            required
            placeholder="Enter father's full name"
          />
        </label>

        <label>
           Age
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            placeholder="Enter your age"
          />
        </label>

        <label>
           CNIC (13 digits)
          <input
            type="text"
            name="cnic"
            maxLength={13}
            value={formData.cnic}
            onChange={handleChange}
            required
            placeholder="1234567890123"
          />
        </label>

        <div className="fee-box">
          <strong>Registration Fee</strong>
          <div className="eth">1 ETH</div>
          <small>This fee will be transferred to the contract owner</small>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Student"}
        </button>
      </form>

      
    </div>
  );
};

export default StudentForm;
