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
    const [loading, setLoading] = useState(false);

    //API Key/ID for Recipes from Edamam APi

    const api_id = '43270d4f';
    const api_key = '0da68851e7400448bb53238835502eb0';

    
    useEffect(() => {
      const fetchUserData = async () => {
        try {
            const user = auth.currentUser;
            const userData = await firestore.collection('users').doc(user.uid).get();
            console.log('userData', userData.data());
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
              setLoading(true);
              const response = await axios.get(`https://api.edamam.com/search?q=${query}&app_id=${api_id}&app_key=${api_key}`);
              const filteredRecipes = response.data.hits.filter(recipe => {
                const ingredients = recipe.recipe.ingredients.map(ingredient => ingredient.food.toLowerCase());
                const containsAllergen = userPreferences.foodAllergies.length > 0 && userPreferences.foodAllergies.some(allergy =>
                    ingredients.some(ingredient => ingredient.includes(allergy.toLowerCase()))
                );
                const meetsDietPreferences = userPreferences.dietPreferences.length > 0 && userPreferences.dietPreferences.every(diet =>
                    ingredients.some(ingredient => ingredient.includes(diet.toLowerCase()))
                );
                return (!containsAllergen || userPreferences.foodAllergies.length === 0) && (!meetsDietPreferences || userPreferences.dietPreferences.length === 0);
            });
            
              setRecipes(filteredRecipes);
          } catch (error) {
              console.error('error filtering', error.message);
          } finally {
              setLoading(false);
          }
      };

      if (query) {
          fetchRecipes();
      }
    }, [query, userPreferences]);

    //still loading
    if (loading) {
      return <div style={{ color: 'white', textAlign: 'center' }} >Loading...</div>;
    }

    // logging recipe into food log
    const handleLogRecipe = (recipe, time) => {
      const user = auth.currentUser;
      if (!user) {
        console.error('no user');
        return;
      }
    
      const { label, calories,yield: servings, url } = recipe.recipe;

      const protein = Math.round(recipe.recipe.totalNutrients.PROCNT.quantity / servings)
      const fat = Math.round(recipe.recipe.totalNutrients.FAT.quantity / servings)
      const carbs = Math.round(recipe.recipe.totalNutrients.CHOCDF.quantity / servings)

      const foodLogData = {
        Name: label,
        Calories: Math.round(calories/servings),
        Date: new Date().toISOString().split('T')[0], // date
        Time: time, 
        RecipeUrl: url,
        Protein: protein,
        Fat: fat,
        Carbohydrates: carbs
      };
    
      firestore.collection('users').doc(user.uid).collection('FoodLog').add(foodLogData)
        .then(() => {
          console.log('logged');
        })
        .catch((error) => {
          console.error('error logging ', error);
        });
    };

    // different times based on buttons
    const handleLogRecipeB = (e) => {
      handleLogRecipe(e, "Breakfast");
    };
  
    const handleLogRecipeL = (e) => {
      handleLogRecipe(e, "Lunch");
    };
  
    const handleLogRecipeD = (e) => {
      handleLogRecipe(e, "Dinner");
    };
  
    const handleLogRecipeS = (e) => {
      handleLogRecipe(e, "Snacks");
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
                  <p> Servings: {recipe.recipe.yield}</p>
                  <p>Ingredients:</p>
                  <ul>
                    {recipe.recipe.ingredients.map(ingredient => (
                      <li key={ingredient.text}>{ingredient.text}</li>
                    ))}
                  </ul>
                  <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">View Recipe</a>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={() => handleLogRecipeB(recipe)}>Breakfast</button>
                    <button onClick={() => handleLogRecipeL(recipe)}>Lunch</button>
                    <button onClick={() => handleLogRecipeD(recipe)}>Dinner</button>
                    <button onClick={() => handleLogRecipeS(recipe)}>Snack</button>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    );
  };
  
  export default RecipeResults;
