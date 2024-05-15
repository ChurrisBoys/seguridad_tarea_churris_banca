import React, { useState, useEffect } from 'react';
import './SocialFeed.css';
import ImgAsset from './public';

export default function DisplayPostsUser({ user, itemsOnPage }) {
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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://172.24.131.195:3001/api/posts/${user}`);
                const databasePosts = await response.json();
                setUserPosts(databasePosts);
                setNumberOfPages(Math.ceil(databasePosts.length / itemsOnPage));
            } catch (error) {
                console.error('Failed to fetch posts', error);
            }
        };

        fetchPosts();
    }, [user, itemsOnPage]);

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
