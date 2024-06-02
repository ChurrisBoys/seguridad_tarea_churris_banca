import React, { useState, useEffect } from 'react';
import '../Social/SocialFeed.css';
import ImgAsset from '../Social/public';
import config from '../../config';
import { authFetch } from '../Common/Utils';

export default function DisplayMyPosts({ itemsOnPage }) {
    const [userPosts, setUserPosts] = useState([]);
    const [actualPage, setPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0);

    const GoToNextPage = (event) => {
        event.preventDefault();
        const nextPage = actualPage + 1;
        if (nextPage <= numberOfPages) {
            setPage(nextPage);
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
            const databasePosts = await response.json();
            setUserPosts(databasePosts);
            setNumberOfPages(Math.ceil(databasePosts.length / itemsOnPage));
        } catch (error) {
            console.error('Failed to fetch posts', error);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, [itemsOnPage]);

    const start = (actualPage - 1) * itemsOnPage;
    const end = actualPage * itemsOnPage;
    const listPosts = userPosts.slice(start, end).map(post => (
        <div className='Post' key={post.id}>
            <div className='PostBody'>
                <img className='PostImage' src={ImgAsset.SocialFeed_PostImage} alt="Post" />
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
    ));

    return (
        <div className='posts_by_me'>
            {listPosts}
            <a href={`#`} onClick={GoToNextPage} className={`NextButton ${actualPage >= numberOfPages ? 'disabled' : ''}`}>
                <span className='NextText Button'>Next</span>
            </a>
        </div>
    );
}