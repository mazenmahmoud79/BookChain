import React from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import './Login.css';

const Login = ({ isAdmin }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    // Redirect the user to the appropriate page based on the isAdmin prop
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <img src="Bookchain.png" alt="BookChain Logo" className="logo" />
      </div>
      <div className="content">
        <div className="login-form">
          <button className="login-button" onClick={handleRedirect}>Login with MetaMask</button>
        </div>
        <div className="login-image">
          <img src="Loginlogo.png" alt="Login illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
