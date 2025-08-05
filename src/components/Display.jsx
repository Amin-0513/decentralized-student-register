// src/components/StudentTable.jsx
import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers'; // ✅ correct import
import abi from './abi.json';
import './Display.css';

const contractAddress = '0xDD69c0964d081e7f580Fbe08a365F22e772f448b';

const Display = () => {
  const [students, setStudents] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask');
        return;
      }

      const provider = new BrowserProvider(window.ethereum); // ✅ fixed here
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);

      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      setWalletAddress(address);

      const studentsData = await contract.getAllStudents();
      setStudents(studentsData);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Only the contract owner can view all students.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="table-container">
      <h2>📋 Registered Students</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Father Name</th>
            <th>Age</th>
            <th>CNIC</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => (
            <tr key={index}>
              <td>{s.id.toString()}</td>
              <td>{s.studentName}</td>
              <td>{s.fatherName}</td>
              <td>{s.age.toString()}</td>
              <td>{s.cnic}</td>
              <td>{s.studentAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Display;
