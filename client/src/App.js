import logo from './logo.png';
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://172.24.131.195:3001/api/users');
        const user = await response.json();
        setUsername(user.username);  // Assuming the user object has a username field
        setPassword(user.password);  // Assuming the user object has a password field
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      fetch('http://172.24.131.195:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          // Do something with the data
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
         {/* <div>   */}
        {/* {data ? <p>{data.message}</p> : <p>Loading...</p>} */}
        {/* </div>  */}
        <img src={logo} className="App-logo" alt="logo" />
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
        </form>
      </header>
    </div>
  );
}

export default App;
