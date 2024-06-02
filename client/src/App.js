import logo from './logo.png';
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import './App.css';
import config from './config';
import { jwtDecode, JwtPayload } from 'jwt-decode';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isValidToken, setIsValidToken] = useState(false); // Track token validity

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/api/users`);
        const user = await response.json();
        setUsername(user.username);  // Assuming the user object has a username field
        setPassword(user.password);  // Assuming the user object has a password field
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();

    // Check token validity on component mount
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setIsValidToken(false);
      }
    }
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const usernameRegex = /^[a-zA-Z]{1,80}(\.[a-zA-Z]{1,80})?$/;
    const passwordRegex = /^[a-zA-Z0-9]{1,80}$/;

    if (!usernameRegex.test(username)) {
      alert('Invalid data');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert('Invalid data');
      return;
    }

    try {
      fetch(`${config.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem('token', data.token); // Store JWT token
          window.location.href = '/social'; // Redirect to the social media page
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Login failed. Please try again.'); // User-friendly error message
        });
    } catch (error) {
      console.error('Error:', error);
      alert('Login failed. Please try again.'); // User-friendly error message
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        {/* <div>   */}
        {/* {data ? <p>{data.message}</p> : <p>Loading...</p>} */}
        {/* </div>  */}
        <img src={logo} className="App-logo" alt="logo" />

        {isValidToken ? (
          // Redirect to /social if token is valid
          <Navigate to="/social" />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                className="App-textbox"
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                className="App-textbox"
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button className='App-Submit-Button' type="submit" onSubmit={handleSubmit} >Submit</button>
          </form>)}
      </header>
    </div>
  );
}

export default App;
