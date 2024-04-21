import React from 'react'
// Using css rules from other pages to reuse
import '../SocialFeed.css'
import './SearchFriends.css'
import ImgAsset from '../public'
import {Link} from 'react-router-dom'

const friends = [
  { friend: 'jony' },
  { friend: 'Garlic', },
  { friend: 'Bob' }
];

function DisplayFriends() {
	// Creating the Friends view
	const listFriends = friends.map(post =>
		<div className='Friend'>
			<div className='FriendBody'>
				<img className='FriendImage' src = {ImgAsset.SocialFeed_PostImage} />
				<span className='user'>{post.friend}</span>
				<div className='FollowButton'>
					<button className='Button Text'>Follow</button>
				</div>
		</div>
	</div>
	);

	return (
		<div className='Friends'>{listFriends}</div>
	);
}


export default function SearchFriends () {
	return (
		<div className='SearchFriends'>
		    <h2 className='Title'>
					Search Friends
        </h2>
			<div className='SearchFriendArea'>
				<textarea className="InputFriendName" placeholder="Your friend's name..."></textarea>
				<span className='Button Text'>Search friend</span>
			</div>
			{DisplayFriends()};
			<Link to='/undefined'>
				<div className='NextButton'>
					<span className='Text Button'>Next</span>
				</div>
			</Link>
		</div>
	)
}