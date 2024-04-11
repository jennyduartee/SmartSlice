import React, { useState, useEffect } from 'react';
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
        about_me: res.about,
        weight: res.weight,
        label: res.label})) //
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}
  
  useEffect(() => {
    // Function to fetch profile data from the Flask API
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('/profile');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    // Call the function to fetch profile data when the component mounts
    fetchProfileData();

    //checks every 5 sec
    //const interval = setInterval(fetchProfileData, 5000);//mew

    // Cleanup function to clear interval
    //return () => clearInterval(interval);//new 
  }, []); // Empty dependency array means this effect runs only once after the first render


  const handleAddToFoodLog = () => {
    // logic to add the displayed information to the food log
  };

  return (
    <div className='homeScreenContainer'> 
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
          <span> {profileData && profileData.weight}</span>
        </div>
        <div>
          <label htmlFor="food">Food:</label>
          <span> {profileData && profileData.label}</span>          
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