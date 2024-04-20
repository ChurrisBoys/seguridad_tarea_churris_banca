import React from 'react'
import './SocialFeed.css'
import ImgAsset from './public'
import {Link} from 'react-router-dom'

const posts = [
  { user: 'jony', text: "MyText1 and my stuff" },
  { user: 'Garlic', text: "MyText2" },
  { user: 'Bob', text: "MyText3" },
];

function DisplayPosts() {
	// Creating the Posts with the raw post data
	const listPosts = posts.map(post =>
		<div className='Post'>
			<div className='PostBody'>
				<img className='PostImage' src = {ImgAsset.SocialFeed_PostImage} />
				<div className='UserAndText'>
				<span className='usuario'>{post.user}</span>
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


export default function SocialFeed () {
	return (
		<div className='SocialFeed_SocialFeed'>
		    <div className='Title'>
					<span className='TitleText'>Social Feed</span>
        </div>
			<div className='SearchUsersButton'>
			<span className='SearchusersText'>Search users</span>
			</div>
			{DisplayPosts()};
			<Link to='/undefined'>
			<div className='NextButton'>
				<span className='NextText'>Next</span>
			</div>
			</Link>
			
		</div>
	)
}