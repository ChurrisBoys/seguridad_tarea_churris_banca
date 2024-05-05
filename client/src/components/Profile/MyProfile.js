import React from 'react';
import { useNavigate } from "react-router-dom"
import ImgAsset from '../Social/public'
import userIcon from './UserIcon.svg'
import Layout from "../Common/Layout";
import './MyProfile.css';
import DisplayPosts from '../Social/DisplayPosts';



function MyProfile() {

    const navigate = useNavigate();

    const handleCreatePost = () => {
        navigate('/createpost');
    };

    return (
        <Layout>
            <div className="MyProfile">
                <div className="user-Info">
                    <img src={userIcon} alt='User Icon' className='user-icon' />
                    <div className='user-text'>
                        <h2 className="title">My Name</h2>
                        <h4>My Info</h4>
                    </div>
                    <div className='create-post-button'>
                        <button className="App-Submit-Button" onClick={handleCreatePost}>Create Post</button>
                    </div>
                </div>

                <h2>My Posts</h2>
                <div className='posts_by_me'>
        			<DisplayPosts itemsOnPage={3}/>
                </div>
            </div>
        </Layout>
    );
}

export default MyProfile;