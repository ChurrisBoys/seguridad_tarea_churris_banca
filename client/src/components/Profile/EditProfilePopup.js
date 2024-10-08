import React, { useState, useEffect } from 'react';
import './EditProfilePopup.css';
import config from '../../config';
import { authFetch } from '../Common/Utils';

const validatePhoneNumber = (phoneNumber) => {
  // Phone number should be exactly 8 digits
  const phoneRegex = /^\d{8}$/;
  return phoneRegex.test(phoneNumber);
};

const validateEmail = (email) => {
  // Email should consist of letters, periods (letters@letters.letters)
  const emailRegex = /^[a-zA-Z]{1,80}(\.[a-zA-Z]{1,80})*@[a-zA-Z]{1,30}(\.[a-zA-Z]{1,30}){1,80}$/;
  return emailRegex.test(email);
};

const EditProfilePopup = ({ onClose, onUpdate, onError }) => {
  const [profile, setProfile] = useState({
    email: '',
    telnum: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await authFetch(`${config.BASE_URL}/api/myprofile/data`);
        if (!response.ok) {
          throw new Error('Error fetching profile data');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile data', error);
      }
    };

    fetchProfileData();
  },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(profile.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!validatePhoneNumber(profile.telnum)) {
      alert("Please enter a valid telephone number (8 digits).");
      return;
    }

    try {
      const response = await fetch(`${config.BASE_URL}/api/myprofile/edit`, {
        method: 'PUT',
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile)
      });

      if (response.status === 401 || response.status === 403) {
        alert('You must be logged in, error: ' + response.status);
        onError();
        onClose();  
      }

      if (!response.ok) {
        throw new Error('Error updating profile');
      }

      alert('Profile updated successfully');
      onUpdate(profile);
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
