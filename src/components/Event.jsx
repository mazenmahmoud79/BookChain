import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractAbi, contractAddress } from './Constant/constant.js';
import { Link } from 'react-router-dom';
import './Event.css';

const Event = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          const address = accounts[0];

          const footballTicketingSystem = new web3.eth.Contract(contractAbi, contractAddress);

          const matches = await footballTicketingSystem.methods.getMatches().call();
          const formattedMatches = matches.map((match) => ({
            matchId: match.matchId.toString(),
            teamA: match.teamA,
            teamB: match.teamB,
            date: match.date,
            venue: match.venue,
            ticketPrice: match.ticketPrice,
            totalTickets: match.totalTickets,
            ticketsSold: match.ticketsSold,
            isActive: match.isActive,
          }));

          setMatches(formattedMatches);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching matches:', error);
          setLoading(false);
        }
      } else {
        alert('MetaMask is not installed. Please install it to use this feature.');
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="container">
      
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="match-cards">
          {matches.map((match) => (
            <div key={match.matchId} className="match-card">
              <h2>Match ID: {match.matchId}</h2>
              <p>Team A: {match.teamA}</p>
              <p>Team B: {match.teamB}</p>
              <Link to={`/book_ticket/${match.matchId}`}>
                <button>Book Ticket</button>
              </Link>
            </div>
          ))}
        </div>
      )}
      <Link to="/transfer">
        <button className="transfer-button">Transfer Ticket</button>
      </Link>
    </div>
  );
};

export default Event;
