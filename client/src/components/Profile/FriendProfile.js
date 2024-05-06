import React from 'react';
import { useNavigate } from "react-router-dom"
import Layout from "../Common/Layout";
import './MyProfile.css';
import DisplayPosts from '../Social/DisplayPosts';



function FriendProfile() {

    const navigate = useNavigate();

    const handleCreatePost = () => {
        navigate('/createpost');
    };

    return (
        <Layout>
            <div className="MyProfile">
                <div className="user-Info">
                    <div className='user-text'>
                        <h2 className="title">My Name</h2>
                        <h4>My Info</h4>
                    </div>
                </div>

                <h2>Previous Posts</h2>
                <div className='posts_by_me'>
        			<DisplayPosts itemsOnPage={3}/>
                </div>
            </div>
        </Layout>
    );
}

export default FriendProfile;