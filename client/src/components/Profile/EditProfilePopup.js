import React, { useState, useEffect } from 'react';
import './EditProfilePopup.css';

const EditProfilePopup = ({ username, onClose }) => {
  const [profile, setProfile] = useState({
    email: '',
    telnum: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/profile/${username}`);
        if (!response.ok) {
          throw new Error('Error fetching profile data');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile data', error);
      }
    };

    fetchProfile();
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/profile/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Error updating profile');
      }

      alert('Profile updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Email:</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="App-textbox"
            />
          </div>
          <div className="form-group">
            <label>New Telephone Number:</label>
            <input
              type="tel"
              name="telnum"
              value={profile.telnum}
              onChange={handleChange}
              className="App-textbox"
            />
          </div>
          <div className='buttons'>
            <button type="submit" id='popUpSave' className="App-Submit-Button">Save</button>
            <button type="button" id='popUpClose' className="App-Submit-Button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;
