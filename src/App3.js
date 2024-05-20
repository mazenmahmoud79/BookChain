import React, { useState, useEffect } from'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Routes, Navigate } from'react-router-dom';

import Login from './components/Login';
import Events from './components/Event';
import Admin from './components/Admin';
import MyTickets from './components/MyTickets';

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
          setAccount(accounts[0]);

          const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
          setContract(contractInstance);

          // Check if the current account is the owner
          const owner = await contractInstance.methods.owner().call();
          setIsAdmin(accounts[0] === owner);
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
      {error? (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin"
            element={isAdmin? <Admin account={account} contract={contract} /> : <Navigate to="/Event" />}
          />
          <Route
            path="/user"
            element={!isAdmin? <Events account={account} contract={contract} /> : <Navigate to="/Admin" />}
          />
          <Route
            path="/voting"
            element={<MyTickets contract={contract} />}
          />
        </Routes>
      )}
    </Router>
  );
};

export default App;