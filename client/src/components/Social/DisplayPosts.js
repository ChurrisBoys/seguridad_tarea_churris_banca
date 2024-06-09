import React, { useState } from 'react'
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './SocialFeed.css'
import ImgAsset from './public'
import config from '../../config';

export default function DisplayPosts(props) {
	const navigate = useNavigate();
	const [posts, setPosts] = useState([]);
	const [actualPage, setPage] = useState(1);
	const [likeTrigger, setLike] = useState(null);
	const [imageData, setImageData] = useState(null);

	const RenderImage = (imageByteData) => {
		const byteArray = new Uint8Array(imageByteData);
		const blob = new Blob([byteArray], { type: 'image/png' }); 
		return URL.createObjectURL(blob);
    };

	const likeOrDislikePost = async (post_id, post_creator, liked) => {
		const serverOperationString = `${config.BASE_URL}/api/posts/liked?`
			+ 'post_id=' + post_id
			+ '&post_creator=' + post_creator
			+ '&liked=' + liked;

		const response = await fetch(serverOperationString, {
			method: 'POST',
			headers: {
				'authorization': 'Bearer ' + localStorage.getItem('token')
			},
		});
		if (response.status === 403 || response.status === 401) {
			alert('You must be logged in, error: ' + response.status);
			navigate("/error");
		}
		if (!response.ok) {
			throw new Error('Error liking or disliking post');
		}
		setLike((likeTrigger + 1) % 6);
	};

	const GoToNextPage = () => {
		const searchParams = new URLSearchParams(window.location.search);
		const nextPage = searchParams.get('page') !== null ? parseInt(searchParams.get('page'))+1 : 2;
		if (nextPage <= numberOfPages) {
                    setPage(nextPage);
                } else {
                    setPage(1);
                }
    };

	// Getting the posts from the database
	useEffect(() => {
		const fetchPosts = async () => {
			try {
			const response = await fetch(`${config.BASE_URL}/api/posts`,
				{
					headers: {
						'authorization': 'Bearer ' + localStorage.getItem('token')
					}
				}
			);
			if (response.status === 403 || response.status === 401) {
				alert('You must be logged in, error: ' + response.status);
				navigate("/error");
			}
			const databasePosts = await response.json();
			setPosts(databasePosts);
			} catch (error) {
				console.error('Failed to fetch posts', error);
			}
		};
		
		fetchPosts();
	}, [likeTrigger]); // Updating the posts when  liked or disliked

		
	// Applying pagination
	const itemsOnPage = props.itemsOnPage;
	const numberOfPages = Math.ceil(posts.length / itemsOnPage);
	const searchParams = new URLSearchParams(window.location.search);
	const start = searchParams.get('page') || 1;

	return (
		<div className='Posts'>
		{posts
			.filter((post, i) => 
				(((start - 1) * itemsOnPage) < i + 1) && 
				(i+1 <= start * itemsOnPage)
			)
			
			// Creating the Posts with the raw post data
			.map(post =>
				<div className='Post'>
					<div className='PostBody'>
						<img className='PostImage' src = {post.image !== null ? RenderImage(post.image.data) : ImgAsset.SocialFeed_PostImage} />
						<div className='UserAndText'>
							<span className='user'>{post.username}</span>
							<span className='Text'>{post.description}</span>
						</div>
					<div className='imageContainer'>
						<div className='imageContainer' onClick={() => likeOrDislikePost(post.id, post.username, 1)}>
							<img className='likeAndDislikeSize likeButton' src = {ImgAsset.likeImage} />
							<span className='Text'>{(post.likes === null) ? (0) : (post.likes)}</span>
						</div>
						<div className='imageContainer' onClick={() => likeOrDislikePost(post.id, post.username, 0)}>
							<img className='likeAndDislikeSize dislikeButton' src = {ImgAsset.dislikeImage} />
							<span className='Text'>{(post.dislikes === null) ? (0) : (post.dislikes)}</span>
						</div>
					</div>
				</div>

			</div>)}
		<a href={`?page=${actualPage}`} className='NextButton' onClick={GoToNextPage}>
			<span className='NextText Button'>Next</span>
		</a>
		</div>
		
	);
}
