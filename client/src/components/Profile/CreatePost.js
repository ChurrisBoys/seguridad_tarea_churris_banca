import React from 'react';
import './CreatePost.css';

function CreatePost() {
  return (
    <div className="CreatePost">
      <div className="top-buttons">
        <div className="buttons-left">
          <button className="button">Friends</button>
          <button className="button">Transactions</button>
        </div>
        <div className="buttons-right">
          <button className="button">My Profile</button>
          <button className="button">Exit</button>
        </div>
      </div>
      <div className="content">
        <h2 className="title">Create Post</h2>
        <button className="App-Submit-Button">Publish</button>
      </div>
      <div className="gray-rectangle"></div>
    </div>
  );
}

export default CreatePost;
