import React from 'react';
import { useNavigate } from "react-router-dom";
import Layout from "../Common/Layout";
import './MyProfile.css';
import DisplayPosts from '../Social/DisplayPostsUser';

function FriendProfile() {
    const navigate = useNavigate();

    // Assuming "Emilia" is the username for which you want to fetch posts
    const username = "Emilia";

    return (
        <Layout>
            <div className="MyProfile">
                <div className="user-Info">
                    <div className='user-text'>
                        <h2 className="title">{username}</h2>
                        <h4>Information about {username}</h4>
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
