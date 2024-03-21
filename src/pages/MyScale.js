import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import '../homeTab.css';
//add import for HTTP requests

const MyScale = () => {
  //HTTP requests
  const [profileData, setProfileData] = useState(null)

  function getData() {
    axios({
      method: "GET",
      url:"/profile",
    })
    .then((response) => {
      const res =response.data
      setProfileData(({
        profile_name: res.name,
        about_me: res.about}))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

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
      <div className='GetDataButtion'>
        <p>To get your profile details: </p><button onClick={getData}>Click me</button>
        {profileData && <div>
              <p>Profile name: {profileData.profile_name}</p>
              <p>About me: {profileData.about_me}</p>
            </div>
        }
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