import React from 'react'
import './SocialFeed.css'
import ImgAsset from './public'

const posts = [
  { user: 'jony', text: "MyText1 and my stuff" },
  { user: 'Garlic', text: "MyText2" },
  { user: 'Bob', text: "MyText3" },
];

export default function DisplayPosts() {
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
			<img className='likeAndDislikeSize likeButton' src = {ImgAsset.likeImage} />
				<img className='likeAndDislikeSize dislikeButton' src = {ImgAsset.dislikeImage} />
			</div>
		</div>
	</div>
	);

	return (
		<div className='Posts'>{listPosts}</div>
	);
}
