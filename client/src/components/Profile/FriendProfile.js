import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import Layout from "../Common/Layout";
import './MyProfile.css';
import config from "../../config";
import DisplayPosts from '../Social/DisplayPostsUser';

function FriendProfile() {

    const { username } = useParams();  // Extract the username

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        fetch(`${config.BASE_URL}/api/profile/${username}`)
            .then(response => response.json())
            .then(data => setUserInfo(data))
            .catch(error => console.error('Error fetching user data:', error));
    }, [username]);

    return (
        <Layout>
            <div className="MyProfile">
                <div className="user-Info">
                    <div className='user-text'>
                        <h2 className="title">{username}</h2>
                        <h4>Information about {username}</h4>
                        {userInfo ? (
                            <div>
                                <p>Phone number: {userInfo.telnum}</p>
                                <p>Email: {userInfo.email}</p>
                            </div>
                        ) : (
                            <p>Loading user information...</p>
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
