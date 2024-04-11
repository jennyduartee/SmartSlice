import React from 'react';
import { Link } from 'react-router-dom';
import '../homeTab.css';

const FoodLog = () => {
  return (
    <div className='homeScreenContainer'>
      <div className="homeContainer">
        <div className="welcome">
          {/*<img src={require('../logo.png')} alt="Logo" />*/}
          SmartSlice Station
        </div>
        <div className="tabs">
          <Link to="/home" className="tab">Home</Link>
          <Link to="/foodlog" className="tab">Food Log</Link>
          {/*<Link to="/nutritionalvalue" className="tab">Nutritional Value</Link> */}
          <Link to="/myscale" className="tab">My Scale</Link>
          <Link to="/myprofile" className="tab">My Profile</Link>
        </div>
      </div>
      <div className='FoodLog'>
        <h1 align='center' >Food Log </h1>
      </div>
      <div>
        <h4 className='FoodLogHeader' align='center' >Breakfast </h4>
      </div>
      <div>
        <h4 className='FoodLogHeader' align='center' >Lunch </h4>
      </div>
      <div>
        <h4 className='FoodLogHeader' align='center' >Dinner </h4>
      </div>
      <div>
        <h4 className='FoodLogHeader' align='center' >Snacks </h4>
      </div>
      
    </div>
  );
};

export default FoodLog;
