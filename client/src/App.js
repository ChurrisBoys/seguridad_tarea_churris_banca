import logo from './logo.png';
import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can implement your logic for handling the login credentials
    console.log('Username:', username);
    console.log('Password:', password);
    // You can send a request to your Node.js backend to authenticate the user
  };



  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/api/data');
      const jsonData = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, []);

  return (
    <div className="App"> 
      <header className="App-header">
      <header className = "App-logo-header"> 
      <img src={logo} className="App-logo" alt="logo" />
      </header>
      {/* <div>   */}
        {/* {data ? <p>{data.message}</p> : <p>Loading...</p>} */}
      {/* </div>  */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label id="username">Username:</label>
            <input
              class = "App-textbox"
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="form-group">
            <label id="password">Password:</label>
            <input
              class = "App-textbox"
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button className='App-Submit-Button' type="submit">Submit</button>
        </form>
        
      </header>
    </div>
  );
}

export default App;
