import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //s
import { auth } from '../firebase/firebase';
import '../style.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  /* Submit button will check if passwords match
  if they do account is created -- will send to another 
  page to fill out more information
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      console.log('User account created');
      await auth.signInWithEmailAndPassword(email, password); // sign in the user after creating!!!!
      console.log('User signed in');
      navigate('/completeprofile'); //sends user to page to complete profile
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="loginContainer">
      <div className="imageContainer">
        <img src="https://domf5oio6qrcr.cloudfront.net/medialibrary/11499/3b360279-8b43-40f3-9b11-604749128187.jpg" alt="Login Image" />
      </div>
      <div className="loginBox">
        <h2 style={{ color: '#557126' }}>SmartSlice Sign Up</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="inputField"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="inputField"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="inputField"
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
