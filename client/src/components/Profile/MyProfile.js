import React from 'react';
import { useNavigate } from "react-router-dom"
import ImgAsset from '../Social/public'
import userIcon from './UserIcon.svg'
import Layout from "../Common/Layout";
import './MyProfile.css';

const posts = [
    { user: 'jony', text: "MyText1 and my stuff" },
    { user: 'Garlic', text: "MyText2" },
  ];

function DisplayPosts() {
	// Creating the Posts with the raw post data
	const listPosts = posts.map(post =>
		<div className='Post'>
			<div className='PostBody'>
				<img className='PostImage' src = {ImgAsset.SocialFeed_PostImage} />
				<div className='UserAndText'>
					<span className='user'>{post.user}</span>
					<span className='Text'>{post.text}</span>
				</div>
			<div className='imageContainer'>
				<img className='likeDislikeButtons' src = {ImgAsset.SocialFeed_likeDislikeButtons} />
			</div>
		</div>
	</div>
	);

	return (
		<div className='Posts'>{listPosts}</div>
	);
}

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
                    {DisplayPosts()}
                </div>
            </div>
        </Layout>
    );
}

export default MyProfile;