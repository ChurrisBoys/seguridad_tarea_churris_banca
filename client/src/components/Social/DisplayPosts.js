import React, { useState } from 'react'
import {useEffect} from 'react';
import './SocialFeed.css'
import ImgAsset from './public'

export default function DisplayPosts(props) {
	const [posts, setPosts] = useState([]);
	const [actualPage, setPage] = useState(1);

	const GoToNextPage = () => {
		const searchParams = new URLSearchParams(window.location.search);
		const nextPage = parseInt(searchParams.get('page'))+1;
		setPage(nextPage <= numberOfPages ? (nextPage) : (numberOfPages));
    };

	// Getting the posts from the database
	useEffect(() => {
		const fetchPosts = async () => {
			try {
			  const response = await fetch('http://localhost:3001/api/posts');
			  const databasePosts = await response.json();
			  setPosts(databasePosts);
			} catch (error) {
			  console.error('Failed to fetch posts', error);
			}
		  };
		
		fetchPosts();
	  }, []);

		
	// Applying pagination
	const itemsOnPage = props.itemsOnPage;
	const numberOfPages = Math.ceil(posts.length / itemsOnPage);
	const searchParams = new URLSearchParams(window.location.search);
	const start = searchParams.get('page') || 1;
	const listPosts = posts
	.filter((post, i) => 
    	(((start - 1) * itemsOnPage) < i + 1) && 
	    (i+1 <= start * itemsOnPage)
	)
	
	// Creating the Posts with the raw post data
	.map(post =>
		<div className='Post'>
			<div className='PostBody'>
				<img className='PostImage' src = {ImgAsset.SocialFeed_PostImage} />
				<div className='UserAndText'>
					<span className='user'>{post.username}</span>
					<span className='Text'>{post.description}</span>
				</div>
			<div className='imageContainer'>
				<img className='likeAndDislikeSize likeButton' src = {ImgAsset.likeImage} />
					<span className='Text'>{(post.likes === null) ? (0) : (post.likes)}</span>
				<img className='likeAndDislikeSize dislikeButton' src = {ImgAsset.dislikeImage} />
				<span className='Text'>{(post.dislikes === null) ? (0) : (post.dislikes)}</span>
			</div>
		</div>

	</div>
	);

	return (
		<div className='Posts'>
		{listPosts}
		<a href={`?page=${actualPage}`} className='NextButton' onClick={GoToNextPage}>
			<span className='NextText Button'>Next</span>
		</a>
		</div>
		
	);
}
