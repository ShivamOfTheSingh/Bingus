"use client";
import React from 'react'
import '@/public/FollowCard.css'
import FollowButton from '../ProfilePageComponents/FollowButton';
import { Following } from '@/lib/db/models';
import { UserProfile } from '@/lib/db/models';

import { useState } from 'react';

interface UserProfileCardProps {
    userProfile: UserProfile;
}

//const variable to get the userInfo: followingId userId followedUserId
//use the userId to get the props info: username, image, isfollowing *might be removed, but included for testing
export default function UserProfileCardFollower({userProfile}: UserProfileCardProps){
    return (
        <div className="user-profile-card">
          <img src={userProfile.profilePicture} alt={`@${userProfile.username}'s profile`} className="profile-image" />

          <h3>{'@' + userProfile.username}</h3>
        </div>
    )
};