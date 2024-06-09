import React, { useState, useEffect } from 'react';
import '../SocialFeed.css';
import './SearchFriends.css';
import { Link, useNavigate } from 'react-router-dom';
import Layout from "../../Common/Layout";
import config from "../../../config";
import { authFetch } from '../../Common/Utils';

export default function SearchFriends() {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const itemsPerPage = 3; 


    const validateUsername = (username) => {
        // Username should consist of only letters and one period in the middle
        const usernameRegex = /^[a-zA-Z]{0,80}(\.[a-zA-Z]{0,80})?$/;
        return usernameRegex.test(username);
    };

      
    const searchUsers = async () => {
        if (!validateUsername(searchTerm)) {
            alert('Invalid search');
            return;
        }
        try {
            const response = await authFetch(`${config.BASE_URL}/api/friends?term=${searchTerm}`);
            if (response.status === 403 || response.status === 401) {
                alert('You must be logged in, error: ' + response.status);
                navigate("/error");
            }
            if (!response.ok) {
                return;
            }
            const data = await response.json();
            setFriends(data);
            setCurrentPage(1);
        } catch (error) {
            setFriends([]);
        }
    };

    const followUser = async (username) => {
        try {
            const response = await authFetch(`${config.BASE_URL}/api/follows/${username}`);
            if (response.status === 403 || response.status === 401) {
                alert('You must be logged in, error: ' + response.status);
                navigate("/error");
            }
            if (!response.ok) {
                return;
            }
            searchUsers(); // Refresh the list after following/unfollowing
        } catch (error) {
            return;
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
