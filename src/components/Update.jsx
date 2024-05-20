import React, { useState } from 'react';
import Web3 from 'web3';
import { contractAbi, contractAddress } from './Constant/constant.js';
import './Update.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Update = () => {
  const [matchId, setMatchId] = useState('');
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();

  const handleUpdateMatch = async (e) => {
    e.preventDefault();

    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        const dateUnixTimestamp = moment(date, 'YYYY-MM-DD').unix();

        // Call the smart contract function to update a match
        await contract.methods.updateMatch(
          matchId,
          teamA,
          teamB,
          dateUnixTimestamp,
          venue,
          web3.utils.toWei(ticketPrice, 'ether'), // Convert ticket price to Wei
          totalTickets,
          isActive
        ).send({ from: address });

        alert('Match updated successfully!');
        // Reset form fields
        setMatchId('');
        setTeamA('');
        setTeamB('');
        setDate('');
        setVenue('');
        setTicketPrice('');
        setTotalTickets('');
        setIsActive(false);
      } catch (error) {
        console.error('Error updating match:', error);
        alert('Failed to update match');
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  return (
    <div className="update-container">
      <div className="header">
        <img src="Bookchain.png" alt="BookChain Logo" className="logo" />
      </div>
      <div className="content">
        <div className="update-form">
          <form onSubmit={handleUpdateMatch}>
            <div className="form-group">
              <label htmlFor="matchId">Match ID</label>
              <input
                type="number"
                id="matchId"
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
                placeholder="Enter match ID"
                required
              />
            </div>
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
            <div className="form-group">
              <label htmlFor="isActive">Is Active</label>
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </div>
            <button className="update-button" type="submit">Update Match</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Update;