import React, { useState, useEffect } from 'react';
import '../homeTab.css';
import { auth, firestore } from '../firebase/firebase';
import axios from "axios";
import { Link } from 'react-router-dom';

const FoodLog = () => {
  const [profileData, setProfileData] = useState(null);
  const [nutritionData] = useState(null);
  const [error, setError] = useState('');
  const [foodLogs, setFoodLogs] = useState([]);
  const [calories, setCalories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // for selecting different dates

  // calculating total calories for each meal based on date that was selected to show below
  const totalCaloriesBreakfast = foodLogs
    .filter((log) => log.Time === "Breakfast" && log.Date === selectedDate)
    .reduce((total, log) => total + log.Calories, 0);

  const totalCaloriesLunch = foodLogs
    .filter((log) => log.Time === "Lunch" && log.Date === selectedDate)
    .reduce((total, log) => total + log.Calories, 0);

  const totalCaloriesDinner = foodLogs
    .filter((log) => log.Time === "Dinner" && log.Date === selectedDate)
    .reduce((total, log) => total + log.Calories, 0);

  const totalCaloriesSnacks = foodLogs
    .filter((log) => log.Time === "Snacks" && log.Date === selectedDate)
    .reduce((total, log) => total + log.Calories, 0);

  useEffect(() => {
    // Fetch profile data
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get('/profile');
        setProfileData(profileResponse.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    // updated to automatically show food log updates without having to refresh page
    if (user) {
      const unsubscribe = firestore.collection('users').doc(user.uid).collection('FoodLog')
        .onSnapshot((querySnapshot) => {
          const logs = [];
          querySnapshot.forEach((doc) => {
            logs.push(doc.data());
          });
          setFoodLogs(logs); // Set the foodLogs state here
        });

      return () => {
        unsubscribe();
      };
    }
  });

  const fetchNutritionData = async (userInput) => {
    // Fetch nutrition data using the provided user input
    //API Key/ID for Nutritional Info from Edamam
    const appKey = '4ddf16b1d5325d099916dc226fc4bae3';
    const appId = 'f6c54d16';
    const weightInGrams = `${profileData.weight}g`;
    const url = `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&ingr=${encodeURIComponent(userInput)},${weightInGrams}&type=public`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      throw error;
    }
  };

  const handleSubmit = async (e, time) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const userInput = profileData.label;
      if (!userInput) {
        console.error('No input provided');
        return;
      }

      const nutritionData = await fetchNutritionData(userInput);
      setCalories(nutritionData);

      // Check if nutritionData and totalNutrients are valid
      if (nutritionData && nutritionData.totalNutrients) {
        // Round up the protein value
        const roundedProtein = parseFloat(nutritionData.totalNutrients.PROCNT?.quantity || 0).toFixed(2);
        const roundedFat = parseFloat(nutritionData.totalNutrients.FAT?.quantity || 0).toFixed(2);
        const roundedCarbs = parseFloat(nutritionData.totalNutrients.CHOCDF?.quantity || 0).toFixed(2);

        const foodLogData = {
          Name: profileData.label,
          Weight: profileData.weight,
          Calories: nutritionData.calories,
          Protein: roundedProtein, // Assign the rounded-up protein value
          Fat: roundedFat,
          Carbs: roundedCarbs,
          Date: new Date().toISOString().split('T')[0],
          Time: time
        };
        await firestore.collection('users').doc(user.uid).collection('FoodLog').add(foodLogData);

        console.log("Calorie value", nutritionData.calories);
        console.log("Calorie value", nutritionData.fat);
      } else {
        throw new Error('Invalid nutrition data or missing protein information');
      }
    } catch (error) {
      console.error('Error updating foodlog:', error);
      setError(error.message);
    }
  };

  // handling different logs based on time
  const handleLogBreakfast = (e) => {
    handleSubmit(e, "Breakfast");
  };

  const handleLogLunch = (e) => {
    handleSubmit(e, "Lunch");
  };

  const handleLogDinner = (e) => {
    handleSubmit(e, "Dinner");
  };

  const handleLogSnacks = (e) => {
    handleSubmit(e, "Snacks");
  };

  // DATE PICKER
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
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
          <Link to="/myscale" className="tab">My Scale</Link>
          <Link to="/myprofile" className="tab">My Profile</Link>
        </div>
      </div>
      <div className='FoodLog'>
        <h1 align='center'>Food Log</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          defaultValue={new Date().toISOString().split('T')[0]}
          style={{ display: 'block', margin: '0 auto' }}
        />
      </div>
      {profileData && (
        <div style={{ color: 'white', textAlign: 'center' }}>
          <p>Log: {profileData.label}</p>
        </div>
      )}
      <div>
        <big><h4 className='FoodLogHeader' align='center'>Breakfast</h4></big>
      </div>
      <form onSubmit={handleLogBreakfast}>
        <div className='GetDataButtion' align='center'>
          <button> Log Breakfast Food </button>
        </div>
      </form>
      <div className='space'></div>

      <div align='center' className='breakfastTable'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Weight</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Fat</th>
              <th>Carbohydrates</th>
            </tr>
          </thead>
          <tbody>
            {foodLogs
              .filter((log) => log.Time === "Breakfast" && log.Date === selectedDate)
              .map((log, index) => (
                <tr key={index}>
                  <td>
                    {log.RecipeUrl ? (
                      <a href={log.RecipeUrl} target="_blank" rel="noopener noreferrer">{log.Name}</a>
                    ) : (
                      log.Name
                    )}
                  </td>
                  <td>{log.Weight} g</td>
                  <td>{log.Calories} cal</td>
                  <td>{log.Protein} g</td>
                  <td>{log.Fat} g</td>
                  <td>{log.Carbs} g</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className='space'></div>
        <big>Total Breakfast Calories: {totalCaloriesBreakfast}</big>
      </div>

      <div>
        <big><h4 className='FoodLogHeader' align='center'>Lunch </h4></big>
      </div>
      <form onSubmit={handleLogLunch}>
        <div className='GetDataButtion' align='center'>
          <button>Log Lunch Food </button>
        </div>
      </form>
      <div className='space'></div>

      <div align='center' className='breakfastTable'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Weight</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Fat</th>
              <th>Carbohydrates</th>
            </tr>
          </thead>
          <tbody>
            {foodLogs
              .filter((log) => log.Time === "Lunch" && log.Date === selectedDate)
              .map((log, index) => (
                <tr key={index}>
                  <td>
                    {log.RecipeUrl ? (
                      <a href={log.RecipeUrl} target="_blank" rel="noopener noreferrer">{log.Name}</a>
                    ) : (
                      log.Name
                    )}
                  </td>
                  <td>{log.Weight} g</td>
                  <td>{log.Calories} cal</td>
                  <td>{log.Protein} g</td>
                  <td>{log.Fat} g</td>
                  <td>{log.Carbs} g</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className='space'></div>
        <big>Total Lunch Calories: {totalCaloriesLunch}</big>
      </div>


      <div>
        <big><h4 className='FoodLogHeader' align='center'>Dinner </h4></big>
      </div>
      <form onSubmit={handleLogDinner}>
        <div className='GetDataButtion' align='center'>
          <button>Log Dinner Food </button>
        </div>
      </form>
      <div className='space'></div>

      <div align='center' className='breakfastTable'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Weight</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Fat</th>
              <th>Carbohydrates</th>
            </tr>
          </thead>
          <tbody>
            {foodLogs
              .filter((log) => log.Time === "Dinner" && log.Date === selectedDate)
              .map((log, index) => (
                <tr key={index}>
                  <td>
                    {log.RecipeUrl ? (
                      <a href={log.RecipeUrl} target="_blank" rel="noopener noreferrer">{log.Name}</a>
                    ) : (
                      log.Name
                    )}
                  </td>
                  <td>{log.Weight} g</td>
                  <td>{log.Calories} cal</td>
                  <td>{log.Protein} g</td>
                  <td>{log.Fat} g</td>
                  <td>{log.Carbs} g</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className='space'></div>
        <big>Total Dinner Calories: {totalCaloriesDinner}</big>
      </div>


      <div>
        <big><h4 className='FoodLogHeader' align='center'>Snacks </h4></big>
      </div>
      <form onSubmit={handleLogSnacks}>
        <div className='GetDataButtion' align='center'>
          <button>Log Snacks Food </button>
        </div>
      </form>
      <div className='space'></div>

      <div align='center' className='breakfastTable'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Weight</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Fat</th>
              <th>Carbohydrates</th>
            </tr>
          </thead>
          <tbody>
            {foodLogs
              .filter((log) => log.Time === "Snacks" && log.Date === selectedDate)
              .map((log, index) => (
                <tr key={index}>
                  <td>
                    {log.RecipeUrl ? (
                      <a href={log.RecipeUrl} target="_blank" rel="noopener noreferrer">{log.Name}</a>
                    ) : (
                      log.Name
                    )}
                  </td>
                  <td>{log.Weight} g</td>
                  <td>{log.Calories} cal</td>
                  <td>{log.Protein} g</td>
                  <td>{log.Fat} g</td>
                  <td>{log.Carbs} g</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className='space'></div>
        <big>Total Snack Calories: {totalCaloriesSnacks}</big>
      </div>

      <div className='space'></div>
    </div>
  );
};

export default FoodLog;