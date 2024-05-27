import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import BankingFeed from './components/Banking/BankingFeed';
import SocialFeed from './components/Social/SocialFeed';
import CreatePost from './components/Profile/CreatePost';
import SearchFriends from './components/Social/SearchFriends/SearchFriends';
import MyProfile from './components/Profile/MyProfile';
import Error from './components/Error/Error';
import FriendProfile from './components/Profile/FriendProfile';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));

// Using Router to define paths to different components
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/banking" element={<BankingFeed />} />
        <Route path="/social" element={<SocialFeed />} />
        <Route path="/search" element={<SearchFriends />} />
        <Route path="/friends/:username" element={<FriendProfile />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/error" element={<Error />} />
      </Routes>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/createpost" element={<CreatePost />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
