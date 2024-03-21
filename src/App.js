import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import CompleteProfile from './pages/CompleteProfile';
import FoodLog from './pages/FoodLog';
import NutritionalValue from './pages/NutritionalValue';
import MyScale from './pages/MyScale';
import MyProfile from './pages/MyProfile';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/completeprofile" element={<CompleteProfile />} />
          <Route path="/foodlog" element={<FoodLog />} />
          <Route path="/nutritionalvalue" element={<NutritionalValue />} />
          <Route path="/myscale" element={<MyScale />} />
          <Route path="/myprofile" element={<MyProfile />} />
        </Routes>
      </Router>
  );
}

export default App;
