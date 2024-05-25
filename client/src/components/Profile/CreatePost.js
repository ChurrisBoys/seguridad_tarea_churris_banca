import React from 'react';
import { useNavigate } from 'react-router-dom';
import camera from './camera.png';
import './CreatePost.css';
import config from '../../config';

function CreatePost() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/');
  };

  const handleTransaction = () => {
    navigate('/banking');
  };

  const handlePostCreation = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch(`${config.BASE_URL}/api/createpost`, {
      method: 'POST',
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: formData,
    });
    if(response.status == 200)
      alert('Post created succesfully!!');
    else
      alert('Error creating Post, image may be too big');
  } 

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
        method="post"
        onSubmit={handlePostCreation}
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
            <textarea id="post-text-id" name="user_description" className="post-text" placeholder="Write a comment..."></textarea>
            {/* the name atribute of the html means a value from the user that will be sent in a POST http request, inside the BODY of that request(you can check that in the Network tab when debugging from a browser) */}
          </div>
          <input name="user_image" id="image" type="file" accept="image/*" style={{ display: 'none' }} />
          <textarea name="logged_in_user" className="nothing" >Emilia</textarea>    {/*// TODO(us): change to actual user */}
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
