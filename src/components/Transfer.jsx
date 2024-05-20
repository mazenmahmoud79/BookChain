import React, { useState } from 'react';
import Web3 from 'web3';
import { contractAbi, contractAddress } from './Constant/constant.js';
import { useParams } from 'react-router-dom';
import './Transfer.css';

const Transfer = () => {
  const { matchId } = useParams();
  const [ticketId, setTicketId] = useState('');
  const [newOwner, setNewOwner] = useState('');

  const handleTransfer = async () => {
    console.log('handleTransfer called');
    if (window.ethereum) {
      try {
        console.log('ticketId:', ticketId);
        console.log('newOwner:', newOwner);
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        const footballTicketingSystem = new web3.eth.Contract(contractAbi, contractAddress);

        await footballTicketingSystem.methods.transferTicket(ticketId, newOwner).send({ from: address });

        console.log('Ticket transferred successfully!');
        alert('Ticket transferred successfully!');
      } catch (error) {
        console.error('Error transferring ticket:', error);
        alert('Failed to transfer ticket');
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  return (
    <div className="transfer-container">
      <h2>Transfer Ticket</h2>
      <form>
        <label>Ticket ID:</label>
        <input type="text" value={ticketId} onChange={(e) => setTicketId(e.target.value)} />

        <label>New Owner:</label>
        <input type="text" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} />

        <button type="button" onClick={handleTransfer}>Transfer Ticket</button>
      </form>
    </div>
  );
};

export default Transfer;
