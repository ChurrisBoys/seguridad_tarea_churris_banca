import React, { useState } from 'react';
import '../SocialFeed.css';
import './SearchFriends.css';
import { Link } from 'react-router-dom';
import Layout from "../../Common/Layout";

export default function SearchFriends() {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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
                                    <button className='Button Text'>Follow</button>
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
