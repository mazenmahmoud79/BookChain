import React, { useState } from'react';
import { useParams } from'react-router-dom';
import Web3 from 'web3';
import { contractAbi, contractAddress } from './Constant/constant.js';
import './Admin.css';

const BookTicket = () => {
  const params = useParams();
  const matchId = params.id;
  const [ticketSeatNumber, setTicketSeatNumber] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
  
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
  
        // Get the match details
        const match = await contract.methods.matches(matchId).call();
        const ticketPrice = match.ticketPrice; // No toString() here
        const totalTickets = match.totalTickets;
        const ticketsSold = match.ticketsSold;
  
        // Check if there are enough tickets available
        if (ticketsSold > totalTickets) {
          alert('Not enough tickets available');
          return;
        }
        
        // Convert ticketPrice to string for web3.utils.toWei
        const ticketPriceInWei = web3.utils.toWei(ticketPrice.toString(10), 'ether');
  
        // Call the smart contract function to purchase a ticket and create it
        await contract.methods.purchaseTicketAndCreate(
          matchId,
          ticketSeatNumber
        ).send({ from: address, value: ticketPriceInWei });
  
        alert(`Ticket purchased successfully for match ${matchId}!`);
        // Reset form fields
        setTicketSeatNumber('');
      } catch (error) {
        console.error('Error purchasing ticket:', error);
        alert('Failed to purchase ticket');
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };
  

  return (
    <div>
      <h1>Book Ticket for Match {matchId}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Match ID:
          <input type="text" value={matchId} readOnly />
        </label>

        <label>
          Ticket Seat Number:
          <input type="number" value={ticketSeatNumber} onChange={(event) => setTicketSeatNumber(event.target.value)} />
        </label>

        <button type="submit">Book Ticket</button>
      </form>
    </div>
  );
};

export default BookTicket;