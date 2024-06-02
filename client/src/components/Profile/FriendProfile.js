import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import Layout from "../Common/Layout";
import './MyProfile.css';
import config from "../../config";
import DisplayPosts from '../Social/DisplayPostsUser';
import { authFetch } from '../Common/Utils';

function FriendProfile() {
    const { username } = useParams();  
    const navigate = useNavigate();   

    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);  

    useEffect(() => {
        authFetch(`${config.BASE_URL}/api/profile/${username}`)
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

    }, [username, navigate]);

    return (
        <Layout>
            <div className="MyProfile">
                <div className="user-Info">
                    <div className='user-text'>
                        <h2 className="title">{username}</h2>
                        <h4>Information about {username}</h4>
                        {error ? (
                            <p>{error}</p>
                        ) : (
                            userInfo ? (
                                <div>
                                    <p>Phone number: {userInfo.telnum}</p>
                                    <p>Email: {userInfo.email}</p>
                                </div>
                            ) : (
                                <p>Loading user information...</p>
                            )
                        )}
                    </div>
                </div>

                <h2>Previous Posts by {username}</h2>
                <div className='posts_by_me'>
                    <DisplayPosts user={username} itemsOnPage={3} />
                </div>
            </div>
        </Layout>
    );
}

export default FriendProfile;
