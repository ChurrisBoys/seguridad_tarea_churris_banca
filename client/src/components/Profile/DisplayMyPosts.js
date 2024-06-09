import React, { useState, useEffect } from 'react';
import '../Social/SocialFeed.css';
import ImgAsset from '../Social/public';
import config from '../../config';
import { authFetch } from '../Common/Utils';

export default function DisplayMyPosts({ itemsOnPage }) {
    const [userPosts, setUserPosts] = useState([]);
    const [actualPage, setPage] = useState(1);
    const [imageData, setImageData] = useState(null);

	const RenderImage = (imageByteData) => {
		const byteArray = new Uint8Array(imageByteData);
		const blob = new Blob([byteArray], { type: 'image/png' }); 
		return URL.createObjectURL(blob);
    };

    const GoToNextPage = (event) => {
        event.preventDefault();
        const nextPage = actualPage + 1;
        if (nextPage <= numberOfPages) {
            setPage(nextPage);
        } else {
           setPage(1);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/delete/${postId}`, {
                method: 'PUT',
			    headers: {
				'authorization': 'Bearer ' + localStorage.getItem('token')
			    }
            });

            if (response.status === 403 || response.status === 401) {
				alert('You must be logged in, error: ' + response.status);
				onError();
			}

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            setUserPosts(userPosts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const fetchMyPosts = async () => {
        try {
            const response = await authFetch(`${config.BASE_URL}/api/myprofile`);
            if (response.status === 403 || response.status === 401) {
				alert('You must be logged in, error: ' + response.status);
				onError();
			}
            const databasePosts = await response.json();
            setUserPosts(databasePosts);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, [itemsOnPage]);

    // Applying pagination
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
                <div className='Post' key={post.id}>
                    <div className='PostBody'>
                        <img className='PostImage' src = {post.image !== null ? RenderImage(post.image.data) : ImgAsset.SocialFeed_PostImage} />
                        <div className='UserAndText'>
                            <span className='user'>{post.username}</span>
                            <span className='Text'>{post.description}</span>
                        </div>
                        <div className='imageContainer'>
                            <img className='likeAndDislikeSize likeButton' src={ImgAsset.likeImage} alt="Like" />
                            <span className='Text'>{post.likes || 0}</span>
                            <img className='likeAndDislikeSize dislikeButton' src={ImgAsset.dislikeImage} alt="Dislike" />
                            <span className='Text'>{post.dislikes || 0}</span>
                            <button className="DeleteButton" onClick={() => handleDeletePost(post.id)}>Delete</button>
                        </div>
                    </div>
                </div>
    
            )}
            <a href={`?page=${actualPage}`} className='NextButton' onClick={GoToNextPage}>
		    	<span className='NextText Button'>Next</span>
		    </a>
        </div>
    );
}
