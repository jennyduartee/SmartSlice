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
  //const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate(); 
/*
  const api_id = '43270d4f';
  const api_key = '0da68851e7400448bb53238835502eb0';

  const getRecipes = async () => {
    const response = await axios.get(`https://api.edamam.com/search?q=${query}&app_id=${api_id}&app_key=${api_key}`);
    setRecipes(response.data.hits);
    navigate('/RecipeResults');
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };  
*/
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
          setCalorieIntake(userData.data().dailyCalories);
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
          <h2 className="calorieBreakdown" >Breakfast - {"0cal"} </h2>
          <h2 className="calorieBreakdown" >Lunch - {"0cal"} </h2>
          <h2 className="calorieBreakdown" >Dinner - {"0cal"} </h2>
          <h2 className="calorieBreakdown" >Snacks - {"0cal"} </h2>
          <h2 className="calorieBreakdown"  >Calories left - {calorieIntake}cal </h2>
        </div>
        <div className='pieChart' style={{ flex: '1' }}>
          <Pie 
            data={{
              labels: ["Breakfast", "Lunch", "Dinner", "Snacks", "Calories Left"],
              datasets: [
                {
                  label: "Calories",
                  data: [0,0,0,0,calorieIntake],
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