import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase/firebase';
import { Chart as ChartJS } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
//import axios from 'axios';
import '../homeTab.css';
import RecipeResults from './RecipleResults';

const Home = () => {
  const [firstName, setFirstName] = useState('');
  const [calorieIntake, setCalorieIntake] = useState('');
  const [query, setQuery] = useState('');
  const [totalCaloriesBreakfast, setTotalCaloriesBreakfast] = useState('');
  const [totalCaloriesLunch, setTotalCaloriesLunch] = useState('');
  const [totalCaloriesDinner, setTotalCaloriesDinner] = useState('');
  const [totalCaloriesSnacks, setTotalCaloriesSnacks] = useState('');
  //const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate(); 
  const today = new Date().toISOString().split('T')[0]; // todays date

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/RecipeResults?query=${query}`);
    //getRecipes();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        const userData = await firestore.collection('users').doc(user.uid).get();
        if (userData.exists) {
          setFirstName(userData.data().firstName);
          setCalorieIntake(userData.data().dailyCalories || 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        //Display something else???
      }
    };

    fetchUserData();
  }, []);

  // used to get total calories of each meal for the day and display on homepage
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      firestore.collection('users').doc(user.uid).collection('FoodLog').onSnapshot((snapshot) => {
        let breakfastTotal = 0;
        let lunchTotal = 0;
        let dinnerTotal = 0;
        let snacksTotal = 0;
        snapshot.forEach((doc) => {
          const log = doc.data();
          if (log.Time === 'Breakfast' && log.Date === today) {
            breakfastTotal += log.Calories;
          } else if (log.Time === 'Lunch' && log.Date === today) {
            lunchTotal += log.Calories;
          } else if (log.Time === 'Dinner' && log.Date === today) {
            dinnerTotal += log.Calories;
          } else if (log.Time === 'Snacks' && log.Date === today) {
            snacksTotal += log.Calories;
          }
        });
        setTotalCaloriesBreakfast(breakfastTotal);
        setTotalCaloriesLunch(lunchTotal);
        setTotalCaloriesDinner(dinnerTotal);
        setTotalCaloriesSnacks(snacksTotal);
      });
    }
  }, []);

  const caloriesLeft = calorieIntake - totalCaloriesBreakfast - totalCaloriesLunch - totalCaloriesDinner - totalCaloriesSnacks;

  //message based on goal
  let message;

  if(caloriesLeft > 0){
    message = "You are on the right track for your goal. Keep it up!";
  } else {
    message = "You didn't hit your goal today. Try again tomorrow!";
  }

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
      <div className='space'></div>
      <div className='space'></div>
      <div align="center" >
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Search Recipes" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className='space'></div>
      <div>
        <h1 className="welcomeUser" align="center"> Welcome, {firstName || "Guest"} </h1>
      </div>
      <div className='homeSpace'></div>
      <div className='calContainer' style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: '1' }}>
          <h2 className="calorieBreakdown" >Here's an overview of your calories for today... </h2>
          <h2 className="calorieBreakdown" >Breakfast - {totalCaloriesBreakfast} cal </h2>
          <h2 className="calorieBreakdown" >Lunch - {totalCaloriesLunch} cal </h2>
          <h2 className="calorieBreakdown" >Dinner - {totalCaloriesDinner} cal </h2>
          <h2 className="calorieBreakdown" >Snacks - {totalCaloriesSnacks} cal </h2>
          <h2 className="calorieBreakdown"  >Calories left - {caloriesLeft} cal </h2>
          <h2 className='calorieBreakdown' >Your daily calorie goal is {calorieIntake} cal. {message}</h2>
        </div>
        <div className='pieChart' style={{ flex: '1' }}>
          <Pie 
            data={{
              labels: ["Breakfast", "Lunch", "Dinner", "Snacks", "Calories Left"],
              datasets: [
                {
                  label: "Calories",
                  data: [totalCaloriesBreakfast, totalCaloriesLunch, totalCaloriesDinner, totalCaloriesSnacks, caloriesLeft],
                  backgroundColor: [
                    '#99aa7d',
                    '#778d51', 
                    '#557126', 
                    '#2b3913', 
                    '#19220b', 
                  ],
                  borderColor: [
                    'white',
                  ],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: 'white',
                    font: {
                      size: 16, 
                    }
                  }
                }
              },
              maintainAspectRatio: false, 
              responsive: true, 
            }}
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );  
};

export default Home;
