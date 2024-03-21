import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, firestore } from '../firebase/firebase';
import '../homeTab.css';

const Home = () => {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        const userData = await firestore.collection('users').doc(user.uid).get();
        if (userData.exists) {
          setFirstName(userData.data().firstName);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        //Display something else???
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className='homeScreenContainer'>
      <div className="homeContainer">
        <div className="homeImageContainer">
          <img src="https://domf5oio6qrcr.cloudfront.net/medialibrary/11499/3b360279-8b43-40f3-9b11-604749128187.jpg" alt="Login Image" />
        </div>
        <div className="welcome">
          <img src={require('../logo.png')} alt="Logo" />
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
      <h1 className="welcomeUser"> Welcome, {firstName || "Guest"} </h1>
    </div>
  );
};

export default Home;
