// src/context/TicketsContext.js
import React, { createContext, useState } from 'react';

export const TicketsContext = createContext();

export const TicketsProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);

  const addTicket = (match) => {
    setTickets([...tickets, match]);
  };

  return (
    <TicketsContext.Provider value={{ tickets, addTicket }}>
      {children}
    </TicketsContext.Provider>
  );
};

  
