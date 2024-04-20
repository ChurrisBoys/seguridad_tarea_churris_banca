import React from 'react';
import { useNavigate } from 'react-router-dom';
import camera from './camera.png';
import './CreatePost.css';

function CreatePost() {
  const navigate = useNavigate(); 

  const handleExit = () => {
    navigate('/'); 
  };

  return (
    <div className="CreatePost">
      <div className="top-buttons">
        <div className="buttons-left">
          <button className="button">Friends</button>
          <button className="button">Transactions</button>
        </div>
        <div className="buttons-right">
          <button className="button">My Profile</button>
          <button className="button" onClick={handleExit}>Exit</button>        
        </div>
      </div>
      <div className="content">
        <h2 className="title">Create Post</h2>
        <button className="App-Submit-Button">Publish</button>
      </div>
      <div className="gray-rectangle">
        <div className="upload-and-comment">
          <label htmlFor="file-input" className="upload-icon-container">
          <img src={camera} alt="Upload Icon" className="upload-icon" />
          </label>
          <textarea className="post-text" placeholder="Write a comment..."></textarea>
        </div>
        <input id="file-input" type="file" style={{ display: 'none' }} />
      </div>
    </div>
  );
}

export default CreatePost;
