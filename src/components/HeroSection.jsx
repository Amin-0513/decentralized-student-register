// src/components/HeroSection.js

import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero">
      <div className="overlay"></div>
      <div className="content">
        <h1>Smart Student Register</h1>
        <p style={{color:'white'}}>
          Secure blockchain-based student registration system with transparent
          record keeping
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
