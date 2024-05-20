// src/components/MyTickets.js
import React, { useContext } from 'react';
import { TicketsContext } from '../context/TicketsContext';
import './MyTickets.css';

const MyTickets = () => {
  const { tickets } = useContext(TicketsContext);

  return (
    <div className="tickets-container">
      <div className="header">
        <img src="Bookchain.png" alt="BookChain Logo" className="logo" />
        <div className="nav-links">
          <a href="/events">Events</a>
          <a href="/profile">Profile</a>
        </div>
      </div>
      <h1 className="tickets-header">My Tickets</h1>
      <div className="tickets">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <div key={ticket.id} className="ticket-box">
              <h2>{ticket.teams}</h2>
              <p>Date: {ticket.date}</p>
              <p>Time: {ticket.time}</p>
              <p>Location: {ticket.location}</p>
            </div>
          ))
        ) : (
          <p>You have no tickets booked.</p>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
