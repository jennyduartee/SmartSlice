import React from 'react';
import { Link } from 'react-router-dom';
import '../homeTab.css';
//add import for HTTP requests

const MyScale = () => {
  //HTTP requests
  

  const handleAddToFoodLog = () => {
    // logic to add the displayed information to the food log
  };

  return (
    <div>
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
      <div className="MyScaleContainer">
        <h2>My Scale</h2>
        <div>
          <label htmlFor="weight">Weight:</label>
          {/* get weight */}
        </div>
        <div>
          <label htmlFor="food">Food:</label>
          {/* get food */}
        </div>
        <div>
          <label htmlFor="calories">Calories:</label>
          {/* get calories */}
        </div>
        <button onClick={handleAddToFoodLog}>Add to Food Log</button>
      </div>
    </div>
  );
};

export default MyScale;
