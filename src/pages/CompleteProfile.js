import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase/firebase';
import '../style.css';

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    currentWeight: '',
    goalWeight: '',
    gender: '',
    birthday: '',
    height: '',
    activityLevel: '',
    dietPreferences: '',
    foodAllergies: '',
    goalIntakes: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      await firestore.collection('users').doc(user.uid).set({
        firstName: formData.firstName,
        lastName: formData.lastName,
        currentWeight: formData.currentWeight,
        goalWeight: formData.goalWeight,
        gender: formData.gender,
        birthday: formData.birthday,
        height: formData.height,
        activityLevel: formData.activityLevel,
        dietPreferences: formData.dietPreferences,
        foodAllergies: formData.foodAllergies,
        goalIntakes: formData.goalIntakes,
      });
      console.log('User profile updated');
      navigate('/home'); // redirect to home page after profile completion
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="loginContainer">
      <div className="imageContainer">
        <img src="https://domf5oio6qrcr.cloudfront.net/medialibrary/11499/3b360279-8b43-40f3-9b11-604749128187.jpg" alt="Login Image" />
      </div>
      <div className="loginBox">
        {/* LOGO
      <div className="logoContainer">
        <img src={require('../logo.png')} alt="Logo" />
      </div> */}
        <h2 style={{ color: '#557126' }}>Complete Your Account</h2>
        <h6 style={{ color: '#000000' }}>Not all fields are required</h6>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="inputField" required />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="inputField" />
          <input type="text" name="currentWeight" value={formData.currentWeight} onChange={handleChange} placeholder="Current Weight" className="inputField" />
          <input type="text" name="goalWeight" value={formData.goalWeight} onChange={handleChange} placeholder="Goal Weight" className="inputField" />
          <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" className="inputField" />
          <input type="text" name="birthday" value={formData.birthday} onChange={handleChange} placeholder="Birthday" className="inputField" />
          <input type="text" name="height" value={formData.height} onChange={handleChange} placeholder="Height" className="inputField" />
          <input type="text" name="activityLevel" value={formData.activityLevel} onChange={handleChange} placeholder="Activity Level" className="inputField" />
          <input type="text" name="dietPreferences" value={formData.dietPreferences} onChange={handleChange} placeholder="Diet Preferences" className="inputField" />
          <input type="text" name="foodAllergies" value={formData.foodAllergies} onChange={handleChange} placeholder="Food Allergies" className="inputField" />
          <input type="text" name="goalIntakes" value={formData.goalIntakes} onChange={handleChange} placeholder="Goal Intakes" className="inputField" />
          <button type="submit">Complete</button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
