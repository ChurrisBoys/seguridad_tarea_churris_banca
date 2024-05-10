import React from 'react'
import {useState} from 'react';
import './SocialFeed.css'
import {Link} from 'react-router-dom'
import Layout from "../Common/Layout";
import DisplayPosts from './DisplayPosts';

export default function SocialFeed () {
	return (
		<Layout>
		<div className='SocialFeedPage'>
			<div className='SearchFriendButton'>
				<h2 className="Title">Social Feed</h2>
				<Link to='/search'>
					<span className='SearchfriendsText Button'>Search friends</span>
				</Link>
			</div>
			<DisplayPosts itemsOnPage={2}/>
		</div>
		</Layout>
	)
}