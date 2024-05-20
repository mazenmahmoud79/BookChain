import React, { useState } from'react';
import Web3 from 'web3';
import { contractAbi, contractAddress } from './Constant/constant.js';

const Book = ({ match }) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [error, setError] = useState(null);

  const handleBook = async () => {
    try {
      // Set up Web3 provider
      const web3 = new Web3(window.ethereum);

      // Get the contract instance
      const contract = new web3.eth.Contract(contractAbi, contractAddress);

      // Call the createTickets function
      await contract.methods.createTickets(match.id, ticketQuantity).send({
        from: window.ethereum.selectedAddress,
      });

      // Update the ticket status
      setTicketQuantity(1); // Reset the ticket quantity
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Book Ticket for {match.teams}</h2>
      <form>
        <label>Ticket Quantity:</label>
        <input type="number" value={ticketQuantity} onChange={(e) => setTicketQuantity(e.target.value)} />
        <button onClick={handleBook}>Book Now</button>
      </form>
      {error && <div style={{ color:'red' }}>{error}</div>}
    </div>
  );
};

export default Book;