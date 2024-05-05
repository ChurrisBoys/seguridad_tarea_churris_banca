import React from 'react';
import { useNavigate } from 'react-router-dom';
import camera from './camera.png';
import './CreatePost.css';

function CreatePost() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/');
  };

  const handleTransaction = () => {
    navigate('/banking');
  };

  return (
    <div className="CreatePost">
      <div className="top-buttons">
        <div className="buttons-left">
          <button className="button">Friends</button>
          <button className="button" onClick={handleTransaction}>Transactions</button>
        </div>
        <div className="buttons-right">
          <button className="button">My Profile</button>
          <button className="button" onClick={handleExit}>Exit</button>
        </div>
      </div>
      <form
        action="http://localhost:3001/api/createpost"
        method="post"
        encType="multipart/form-data"
        className="form-content"
      >
        <div className="content">
          <h2 className="title">Create Post</h2>
          <button className="App-Submit-Button">Publish</button>
        </div>
        <div className="gray-rectangle">
          <div className="upload-and-comment">
            <label for="image" className="upload-icon-container">
              <img src={camera} alt="Upload Icon" className="upload-icon" />
            </label>
            <textarea id="post-text-id" name="user-description" className="post-text" placeholder="Write a comment..."></textarea>
          </div>
          <input name="user-image" id="image" type="file" accept="image/*" style={{ display: 'none' }} />
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
