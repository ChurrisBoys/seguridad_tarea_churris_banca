import React, { useState, useEffect } from 'react';
import '../SocialFeed.css';
import './SearchFriends.css';
import { Link } from 'react-router-dom';
import Layout from "../../Common/Layout";

export default function SearchFriends() {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFriends();
    }, [searchTerm]); // Trigger fetchFriends when searchTerm changes

    const fetchFriends = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/friends?term=${searchTerm}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFriends(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setFriends([]);
        }
    };

    const followUser = async (username) => {
        try {
            const response = await fetch(`http://localhost:3001/api/follows/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ follower: 'Emilia' }) // Assuming Emilia is the follower
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // After successful follow, update the friends list
            fetchFriends();
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

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
                    <button className='Button Text' onClick={fetchFriends}>Search friend</button>
                </div>
                <div className='Friends'>
                    {friends.map(friend => (
                        <div key={friend.username} className='Friend'>
                            <div className='FriendBody'>
                                <span className='user'>{friend.username}</span>
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
                <Link to='/undefined'>
                    <div className='NextButton'>
                        <span className='Text Button'>Next</span>
                    </div>
                </Link>
            </div>
        </Layout>
    );
}
