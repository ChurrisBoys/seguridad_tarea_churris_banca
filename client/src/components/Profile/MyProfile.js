import React , { useState, useEffect }from 'react';
import { useNavigate } from "react-router-dom"
import ImgAsset from '../Social/public'
import Layout from "../Common/Layout";
import './MyProfile.css';
import DisplayPosts from '../Social/DisplayPosts';
import EditProfilePopup from './EditProfilePopup';


function MyProfile() {
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const username = 'Emilia'; // TODO: Change to actual user

    const handleCreatePost = () => {
        navigate('/createpost');
    };

    const handleEditProfile = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <Layout>
            <div className="MyProfile"> 
                <div className="user-Info">
                    <div className='user-text'>
                        <h1 className="title">My Name</h1>
                        <h3>My Info</h3>
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
        			<DisplayPosts itemsOnPage={3}/>
                </div>
            </div>
            {isPopupOpen && <EditProfilePopup username={username} onClose={closePopup} />}
        </Layout>
    );
}

export default MyProfile;