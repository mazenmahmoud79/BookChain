import React, { useState } from'react';
import Web3 from 'web3';
import { contractAbi, contractAddress } from './Constant/constant.js';
import './Admin.css';
import moment from'moment';
import { useNavigate } from 'react-router-dom'; 
// Import the useNavigate hook

const Admin = () => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');


  const navigate = useNavigate();
  
  const createMatch = async (e) => {
    e.preventDefault();
  
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
  
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
  
        const dateUnixTimestamp = moment(date, 'YYYY-MM-DD').unix();
  
        // Call the smart contract function to create a match
        await contract.methods.createMatch(
          teamA,
          teamB,
          dateUnixTimestamp,
          venue,
          web3.utils.toWei(ticketPrice, 'ether'), // Convert ticket price to Wei
          totalTickets
        ).send({ from: address });
  
        alert('Match created successfully!');
        // Reset form fields
        setTeamA('');
        setTeamB('');
        setDate('');
        setVenue('');
        setTicketPrice('');
        setTotalTickets('');
      } catch (error) {
        console.error('Error creating match:', error);
        alert('Failed to create match');
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  const handleUpdateMatch = () => {
    navigate('/update'); // Navigate to the Update component
  };


  return (
    <div className="admin-container">
      <div className="header">
        <img src="Bookchain.png" alt="BookChain Logo" className="logo" />
      </div>
      <div className="content">
        <div className="admin-form">
          <form onSubmit={createMatch}>
            <div className="form-group">
              <label htmlFor="teamA">Team A</label>
              <input
                type="text"
                id="teamA"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                placeholder="Enter team A"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="teamB">Team B</label>
              <input
                type="text"
                id="teamB"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                placeholder="Enter team B"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="venue">Venue</label>
              <input
                type="text"
                id="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Enter venue"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="ticketPrice">Ticket Price (in ETH)</label>
              <input
                type="number"
                id="ticketPrice"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                placeholder="Enter ticket price"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="totalTickets">Total Tickets</label>
              <input
                type="number"
                id="totalTickets"
                value={totalTickets}
                onChange={(e) => setTotalTickets(e.target.value)}
                placeholder="Enter total tickets"
                required
              />
            </div>
            <button className="admin-button" type="submit">Create Match</button>
          </form>
        </div>
        <button className="admin-button" type="submit" onClick={handleUpdateMatch}>Update Match</button>
      </div>
    </div>
  );
};

export default Admin;