import { Container, Row, Col, Button } from "react-bootstrap";
import { UserProfile, UserSettings } from "@/lib/db/models";
import Image from "next/image";
import profilePicTemp from "@/public/profile-pic-temp.jpg";
import Link from "next/link";
import '@/public/ProfileInfo.css';

interface ProfilePageInfoSelfProps {
  profile: UserProfile;
  numPosts: number;
  numFollowers: number;
  numFollowing: number;
  settings: UserSettings;
  className?: string;
}

export default function ProfilePageInfoSelf({ profile, numPosts, numFollowers, numFollowing, settings }: ProfilePageInfoSelfProps) {
  return (
    <div className="profile-section">
      {/* Profile Picture */}
      <div className="profile-picture">
        <Image
          src={profile.profilePicture || profilePicTemp}
          alt={`${profile.username}'s profile`}
          width={150}
          height={150}
        />
      </div>
      {/* Stats Box */}
      <div className="profile-stats-box">
        <div className="stat-item">
          <strong>{numPosts}</strong>
          <p>Posts</p>
        </div>
        <div className="stat-item">
          <strong>{numFollowers}</strong>
          <p>Followers</p>
        </div>
        <div className="stat-item">
          <strong>{numFollowing}</strong>
          <p>Following</p>
        </div>
      </div>
    </div>
  );
}

