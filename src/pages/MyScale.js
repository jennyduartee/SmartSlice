import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import '../homeTab.css';

const MyScale = () => {
  const [profileData, setProfileData] = useState(null);
  const [calories, setCalories] = useState(null); // State variable for calories

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('/profile');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchNutritionData = async () => {
      if (!profileData) return; // Exit if profile data is not available
      //API Key/ID for Nutritional Info from Edamam
      const appKey = '4ddf16b1d5325d099916dc226fc4bae3';
      const appId = 'f6c54d16';
      const weightInGrams = `${profileData.weight}g`;
      const url = `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&ingr=${encodeURIComponent(profileData.label)},${weightInGrams}&type=public`;

      try {
        const response = await axios.get(url);
        const nutritionData = response.data; // set the response to this 
        setCalories(nutritionData.calories); // Set calories to the state variable
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
      }
    };

    fetchNutritionData();
  }, [profileData]); // Fetch nutrition data when profileData changes

  return (
    <div className='homeScreenContainer'> 
      <div className="homeContainer">
        <div className="welcome">
          SmartSlice Station
        </div>
        <div className="tabs">
          <Link to="/home" className="tab">Home</Link>
          <Link to="/foodlog" className="tab">Food Log</Link>
          <Link to="/myscale" className="tab">My Scale</Link>
          <Link to="/myprofile" className="tab">My Profile</Link>
        </div>
      </div>
      <div className='homeSpace'></div>
      <div className='scaleBox'>
        <div className='space'></div>
        <div className="MyScaleContainer" >
          <h1>My Scale</h1>
          <div>
            <big><label htmlFor="weight" >Weight: </label> 
            <span> {profileData && profileData.weight}</span>
            <label > g</label></big>
          </div>
          <div className='space'></div>
          <div>
            <big><label htmlFor="food">Food:</label>
            <span> {profileData && profileData.label}</span></big>          
          </div>
          <div className='space'></div>
          <div>
            <big><label htmlFor="calories">Calories:</label>
            <span>{calories}</span>
            <label > cal</label></big>
          </div>
          <div className='space'></div>
        </div>
      </div>
    </div>  
  );
};

export default MyScale;
