import React from 'react';
import { Link } from 'react-router-dom';
import '../homeTab.css';

const NutritionalValue = () => {
  return (
    <div className="homeContainer">
      <div className="welcome">
        SmartSlice Station
      </div>
      <div className="tabs">
        <Link to="/home" className="tab">Home</Link>
        <Link to="/foodlog" className="tab">Food Log</Link>
        <Link to="/nutritionalvalue" className="tab">Nutritional Value</Link>
        <Link to="/myscale" className="tab">My Scale</Link>
        <Link to="/myprofile" className="tab">My Profile</Link>
      </div>
    </div>
  );
};

export default NutritionalValue;
