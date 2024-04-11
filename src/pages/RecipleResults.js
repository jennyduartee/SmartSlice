import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth, firestore } from '../firebase/firebase';
import axios from 'axios';
import '../homeTab.css';
import '../recipeResults.css'

const RecipeResults = ({ recipe }) => {
    const [recipes, setRecipes] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');
    const [userPreferences, setUserPreferences] = useState({});


    const api_id = '43270d4f';
    const api_key = '0da68851e7400448bb53238835502eb0';

    
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const user = auth.currentUser;
            const userData = await firestore.collection('users').doc(user.uid).get();
            if (userData.exists) {
              setUserPreferences({
                foodAllergies: userData.data().foodAllergies || [],
                dietPreferences: userData.data().dietPreferences || [],
              });
            }
          } catch (error) {
            console.error('error getting data', error.message);
          }
        };
      
        fetchUserData();
      }, []);
      
    /* if a user has allergies or diet preferences recipes should be automatically filtered
    out based on the information they provided. if a user fills in None or leaves it blank
    it can show all recipes.*/
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
              const response = await axios.get(`https://api.edamam.com/search?q=${query}&app_id=${api_id}&app_key=${api_key}`);
              const filteredRecipes = response.data.hits.filter(recipe => {
                const ingredients = recipe.recipe.ingredients.map(ingredient => ingredient.food.toLowerCase());
                const containsAllergen = userPreferences.foodAllergies.some(allergy =>
                  ingredients.some(ingredient => ingredient.includes(allergy.toLowerCase()))
                );
                const meetsDietPreferences = userPreferences.dietPreferences.every(diet =>
                  ingredients.some(ingredient => ingredient.includes(diet.toLowerCase()))
                );
                return !containsAllergen && meetsDietPreferences;
              });
              setRecipes(filteredRecipes);
              //setRecipes(response.data.hits)
            } catch (error) {
              console.error('error filtering', error.message);
            }
          };
          
    
        if (query) {
          fetchRecipes();
        }
      }, [query, userPreferences]);
    
    return (
      <div className='homeScreenContainer'>
        <div className="homeContainer">
          <div className="welcome">
            SmartSlice Station
          </div>
          <div className="tabs">
            <Link to="/home" className="tab">Home</Link>
            <Link to="/foodlog" className="tab">Food Log</Link>
            {/*<Link to="/nutritionalvalue" className="tab">Nutritional Value</Link>*/}
            <Link to="/myscale" className="tab">My Scale</Link>
            <Link to="/myprofile" className="tab">My Profile</Link>
          </div>
        </div>
        <div className='recipeResultsContainer'>
          <h1 align="center">Recipe Results</h1>
          <div className='recipeList'>
            {recipes.map(recipe => (
              <div className='recipeCard' key={recipe.recipe.uri}>
                <img src={recipe.recipe.image} alt={recipe.recipe.label} />
                <div className='recipeDetails'>
                  <h2>{recipe.recipe.label}</h2>
                  <p>Calories: {Math.round(recipe.recipe.calories)}</p>
                  <p>Ingredients:</p>
                  <ul>
                    {recipe.recipe.ingredients.map(ingredient => (
                      <li key={ingredient.text}>{ingredient.text}</li>
                    ))}
                  </ul>
                  <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">View Recipe</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    );
  };
  
  export default RecipeResults;