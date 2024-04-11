import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase/firebase';
import { useEffect } from 'react';
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

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      firestore.collection('users').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setFormData({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              currentWeight: userData.currentWeight || '',
              goalWeight: userData.goalWeight || '',
              gender: userData.gender || '',
              birthday: userData.birthday || '',
              height: userData.height || '',
              activityLevel: userData.activityLevel || '',
              dietPreferences: userData.dietPreferences || '',
              foodAllergies: userData.foodAllergies || '',
              goalIntakes: userData.goalIntakes || '',
            });
          }
        })
        .catch((error) => {
          console.error('Error getting user data:', error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // need to add to handle array
    if (name === 'foodAllergies' || name === 'dietPreferences') {
      // needs to separate by commas
      const valuesArray = value.split(',').map(item => item.trim());
      setFormData({ ...formData, [name]: valuesArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  


const calculateDailyCalories = (formData) => {
  const { gender, currentWeight, goalWeight, height, birthday, activityLevel } = formData;

  // age calc
  const birthDate = new Date(birthday);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  // bmr calc
  let bmr = 0;
  if (gender == "male" || gender == "other") {
    bmr = 66 + (6.23 * currentWeight) + (12.7 * height) - (6.8 * age);
  } else if (gender == "female") {
    bmr = 655 + (4.35 * currentWeight) + (4.7 * height) - (4.7 * age);
  }

  // activity level
  let calorieIntake = 0;
  if (activityLevel == "low") {
    calorieIntake = bmr * 1.2;
  } else if (activityLevel == "medium") {
    calorieIntake = bmr* 1.55;
  } else if (activityLevel == "high") {
    calorieIntake = bmr * 1.725;
  }

  // weight goal
  if (goalWeight > currentWeight) {
    calorieIntake += 500;
  } else if (goalWeight < currentWeight) {
    calorieIntake -= 500;
  }

  return Math.round(calorieIntake);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const user = auth.currentUser;

    await firestore.collection('users').doc(user.uid).set({
      firstName: formData.firstName,
      lastName: formData.lastName,
      currentWeight: parseInt(formData.currentWeight),
      goalWeight: parseInt(formData.goalWeight),
      gender: formData.gender,
      birthday: formData.birthday,
      height: parseInt(formData.height),
      activityLevel: formData.activityLevel,
      dietPreferences: formData.dietPreferences,
      foodAllergies: formData.foodAllergies,
      goalIntakes: formData.goalIntakes,
    });
    console.log('User profile updated');

    // calculate daily calories after info gets stored to firebase
    const calorieIntake = calculateDailyCalories(formData);

    // daily calorie calculation to firebase
    await firestore.collection('users').doc(user.uid).update({
      dailyCalories: calorieIntake,
    });

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
        <h6 style={{ color: 'red' }}>* Not all fields are required *</h6>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name: </label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
          </div>
          <div className='space'></div>
          <div>
            <label>Last Name: </label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
          </div>
          <div className='space'></div>
          <div>
            <label>Current Weight: </label>
            <input type="text" name="currentWeight" value={formData.currentWeight} onChange={handleChange} placeholder="Current Weight" />
            <label>lbs </label>
          </div>
          <div className='space'></div>
          <div>
            <label>Goal Weight: </label>
            <input type="text" name="goalWeight" value={formData.goalWeight} onChange={handleChange} placeholder="Goal Weight" />
            <label>lbs </label>
          </div>
          <div className='space'></div>
          <div className='inputField'>
            <label>Gender: </label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label>Birth date: </label>
            <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} placeholder="Birthday" />
          </div>
          <div className='space'></div>
          <div className='inputField'>
            <label> Activity Level: </label>
            <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
              <option value="">Select Activity Level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className='inputField'>
            <label>Height: </label>
            <select id="height" name="height" value={formData.height} onChange={handleChange}> 
              <option value="">Select Height</option>
              <option value="48">4'0</option>
              <option value="49">4'1</option>
              <option value="50">4'2</option>
              <option value="51">4'3</option>
              <option value="53">4'4</option>
              <option value="53">4'5</option>
              <option value="54">4'6</option>
              <option value="55">4'7</option>
              <option value="56">4'8</option>
              <option value="57">4'9</option>
              <option value="58">4'10</option>
              <option value="59">4'11</option>
              <option value="60">5'0</option>
              <option value="61">5'1</option>
              <option value="62">5'2</option>
              <option value="63">5'3</option>
              <option value="64">5'4</option>
              <option value="65">5'5</option>
              <option value="66">5'6</option>
              <option value="67">5'7</option>
              <option value="68">5'8</option>
              <option value="69">5'9</option>
              <option value="70">5'10</option>
              <option value="71">5'11</option>
              <option value="72">6'0</option>
              <option value="73">6'1</option>
              <option value="74">6'2</option>
              <option value="75">6'3</option>
              <option value="76">6'4</option>
              <option value="77">6'5</option>
              <option value="78">6'6</option>
              <option value="79">6'7</option>
              <option value="80">6'8</option>
              <option value="81">6'9</option>
              <option value="82">6'10</option>
              <option value="83">6'11</option>
            </select>
          </div>
          <div>
            <label>Diet Preferences: </label>
            <input type="text" name="dietPreferences" value={formData.dietPreferences} onChange={handleChange} placeholder="Diet Preferences" />
          </div>
          <div className='space'></div>
          <div>
            <label>Food Allergies: </label>
            <input type="text" name="foodAllergies" value={formData.foodAllergies} onChange={handleChange} placeholder="Food Allergies" />
          </div>
          <div className='space'></div>
          <div>
            <label>Goal Intakes: </label>
            <input type="text" name="goalIntakes" value={formData.goalIntakes} onChange={handleChange} placeholder="Goal Intakes" />
          </div>
          <div className='space'></div>
          <button type="submit">Complete</button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;