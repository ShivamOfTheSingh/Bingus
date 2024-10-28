"use client";
import React from 'react'
import '@/public/FollowCard.css'
import Link from 'next/link';
import { UserProfile } from '@/lib/db/models';

interface UserProfileCardProps {
    profile: UserProfile;
}

export default function FollowCardOther({profile}: UserProfileCardProps){
    return (
        <Link href={`/profile/${profile.userId}`} className="user-profile-card">
          <img src={profile.profilePicture} alt={`@${profile.username}'s profile`} className="profile-image" />
          <h3>{'@' + profile.username}</h3>
        </Link>
    )
};