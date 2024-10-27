"use client";
import React from 'react'
import '@/public/FollowCard.css'
import FollowButton from '../ProfilePageComponents/FollowButton';
import { Following } from '@/lib/db/models';
import { UserProfile } from '@/lib/db/models';

interface UserProfileCardProps {
    profile: UserProfile;
    following: Following;
}

export default function FollowCardSelf({profile, following}: UserProfileCardProps){
    return (
        <div className="user-profile-card">
          <img src={profile.profilePicture} alt={`@${profile.username}'s profile`} className="profile-image" />

          <h3>{'@' + profile.username}</h3>
          <FollowButton following={following} />
        </div>
    )
};