import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Web3 from 'web3';
import Login from './components/Login';
import Event from './components/Event';
import Admin from './components/Admin';
import Book from './components/Book';
import BookTicket from './components/BookTicket'
import Update from './components/Update';
import Transfer from './components/Transfer';
import { contractAbi, contractAddress } from './components/Constant/constant';

const App = () => {
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]); // Changed to index 0, assuming admin account is first

          const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
          setContract(contractInstance);

          // Fetch the owner address
          const ownerAddress = await contractInstance.methods.owner().call();

          // Determine if the current account is the owner
          setIsAdmin(accounts[0] === ownerAddress);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
          setError('Error connecting to MetaMask. Please try refreshing the page or make sure MetaMask is properly installed.');
        }
      } else {
        setError('MetaMask is not installed. Please install MetaMask to use this application.');
      }
    };

    loadBlockchainData();
  }, []);

  return (
    <Router>
      {error ? (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login isAdmin={isAdmin} />} />
          <Route path="/admin" element={<Admin account={account} contract={contract} />} />
          <Route path="/update" element={<Update account={account} contract={contract} />} />
          <Route path="/user" element={<Event account={account} contract={contract} />} />
          <Route path="/book" element={<Book contract={contract} />} />
          <Route path="/book_ticket/:id" element={<BookTicket />} />
          <Route path="/transfer" element={<Transfer contract={contract} />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
