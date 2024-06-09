import React , { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import Layout from "../Common/Layout";
import './MyProfile.css';
import DisplayMyPosts from './DisplayMyPosts';
import EditProfilePopup from './EditProfilePopup';
import config from '../../config';
import { authFetch } from '../Common/Utils';


function MyProfile() {
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);  

    useEffect(() => {
        authFetch(`${config.BASE_URL}/api/myprofile/data`)
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    alert('You must be logged in, error: ' + response.status);
                    navigate("/error");
                    return;  
                }
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setUserInfo(data);
                } else {
                    navigate("/error");
                }
            })
            .catch(error => {
                navigate("/error"); 
            });

    }, [navigate]);

    const handleCreatePost = () => {
        navigate('/createpost');
    };

    const handleEditProfile = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const updateUserInfo = (updatedProfile) => {
        setUserInfo(updatedProfile);
    }

    const displayError = () => {
        navigate('/error');
    };

    return (
        <Layout>
            <div className="MyProfile"> 
                <div className="user-Info">
                    <div className='user-text'>
                        {error ? (
                            <p>{error}</p>
                        ) : (
                            userInfo ? (
                                <div>
                                    <h2 className="title">{userInfo.username}</h2>
                                    <h4>Information about {userInfo.username}</h4>
                                    <p>Phone number: {userInfo.telnum}</p>
                                    <p>Email: {userInfo.email}</p>
                                </div>
                            ) : (
                                <p>Loading user information...</p>
                            )
                        )}
                    </div>
                    <div className='modify-personal-info-button'>
                        <button className="App-Submit-Button" onClick={handleEditProfile}>Edit</button>
                    </div>
                    <div className='create-post-button'>
                        <button className="App-Submit-Button" onClick={handleCreatePost}>Create Post</button>
                    </div>
                </div>

                <h2>My Posts</h2>
                <div className='posts_by_me'>
        			<DisplayMyPosts itemsOnPage={3} onError={displayError}/>
                </div>
            </div>
            {isPopupOpen && <EditProfilePopup onClose={closePopup} onUpdate={updateUserInfo} onError={displayError} />}
        </Layout>
    );
}

export default MyProfile;