import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import '../homeTab.css';

const MyProfile = () => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await auth.signOut();
      navigate('/'); // navigate to login page
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const handleChangeProfile = () => {
    navigate('/completeprofile');
  }

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
      <button onClick={handleLogOut} className="LogoutButton">
        Log Out
      </button>
      <button onClick={handleChangeProfile} className="ChangeProfile">
        Change Profile Information
      </button>
    </div>
  );
};

export default MyProfile;