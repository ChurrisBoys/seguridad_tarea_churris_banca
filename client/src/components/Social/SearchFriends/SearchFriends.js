import React, { useState, useEffect } from 'react';
import '../SocialFeed.css';
import './SearchFriends.css';
import { Link } from 'react-router-dom';
import Layout from "../../Common/Layout";
import config from "../../../config";
import { authFetch } from '../../Common/Utils';

export default function SearchFriends() {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; 

    useEffect(() => {
        searchUsers();
    }, [searchTerm]);

    const searchUsers = async () => {
        try {
            const response = await authFetch(`${config.BASE_URL}/api/friends?term=${searchTerm}`);
            console.log("Status " + response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFriends(data);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching data:', error);
            setFriends([]);
        }
    };

    const followUser = async (username) => {
        try {
            const response = await authFetch(`${config.BASE_URL}/api/follows/${username}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            searchUsers(); // Refresh the list after following/unfollowing
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const goToNextPage = () => {
        let nextPage = currentPage + 1;
        const totalPages = Math.ceil(friends.length / itemsPerPage);
        if (nextPage > totalPages) {
            nextPage = 1; // Loop back to the first page
        }
        setCurrentPage(nextPage);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedFriends = friends.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Layout>
            <div className='SearchFriends'>
                <h2 className='Title'>Search Friends</h2>
                <div className='SearchFriendArea'>
                    <input 
                        type="text" 
                        className="InputFriendName" 
                        placeholder="Your friend's name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className='Button Text' onClick={searchUsers}>Search friend</button>
                </div>
                <div className='Friends'>
                {selectedFriends.map(friend => (
                    <div key={friend.username} className='Friend'>
                        <div className='FriendBody'>
                            {friend.isMutual ? (
                                <Link to={`/friends/${friend.username}`} className='user'>{friend.username}</Link>
                            ) : (
                                <span className='user'>{friend.username}</span>
                            )}
                            <div className='FollowButton'>
                                <button 
                                    className='Button Text' 
                                    onClick={() => followUser(friend.username)}
                                >
                                    {friend.followed ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
                <div className='NextButton' onClick={goToNextPage}>
                    <span className='Text Button'>Next</span>
                </div>
            </div>
        </Layout>
    );
}
