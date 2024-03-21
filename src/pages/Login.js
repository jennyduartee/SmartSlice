import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //s
import { auth } from '../firebase/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import '../style.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  /* Normal sign in
  ** if suceesfull redirects to home page else error message
  */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log('User logged in');
      navigate('/home'); //sends user to home page
    } catch (error) {
      setError(error.message);
    }
  };

  /* Google Sign In 
  ** Able to make sure if its the first time signing in with google 
  ** that they are redirected otherwise can be redirected to home page
  */
  const handleGoogleSignIn = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
      console.log('User logged in with Google');
      navigate('/home'); //s
    } catch (error) {
      setError(error.message);
    }
  };

  /* When signup button is clicked redirects to signup page */
  const handleSignUp = async (e) => {
    navigate('/SignUp'); //s
  };

  /* Components */
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
        <h2 style={{ color: '#557126' }}>Log Into SmartSlice</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="inputField"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="inputField"
          />
          <button type="submit" class="loginButton">Log In</button>
        </form>
        <button onClick={handleGoogleSignIn} className="googleButton">
            <img src="https://www.gstatic.com/images/branding/productlogos/googleg/v6/36px.svg" alt="Google Logo" className="googleLogo" />
            Sign in with Google
        </button>
        <p>Don't have an account? </p>
        <button onClick={handleSignUp} className="signupButton">
            Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;


