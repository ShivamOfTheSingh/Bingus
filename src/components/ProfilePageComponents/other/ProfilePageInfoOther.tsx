"use client";

import { UserProfile, UserSettings } from "@/lib/db/models";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import profilePicTemp from "@/public/profile-pic-temp.jpg";
import Link from "next/link";
import "@/public/ProfileInfo.css";

interface ProfilePageInfoOtherProps {
  profile: UserProfile;
  numPosts: number;
  numFollowers: number;
  numFollowing: number;
  settings: UserSettings;
  className?: string;
}

export default function ProfilePageInfoOther({
  profile,
  numPosts,
  numFollowers,
  numFollowing,
  settings,
  className = "",
}: ProfilePageInfoOtherProps) {
  const displayName = settings.showName
    ? `${profile.firstName} ${profile.lastName}`
    : profile.username;

  const profileImage = profile.profilePicture || profilePicTemp;

  return (
    <Container className={`${className} py-4 custom-container`}>
      <Row className="align-items-center">
        {/* Profile Section */}
        <Col xs={4} className="profile-section">
          <div className="pfp-info text-center">
            <h2>{displayName}</h2>
            <Image
              src={profileImage}
              alt={`${profile.username}'s profile picture`}
              width={200}
              height={200}
              className="rounded-circle"
            />
          </div>
        </Col>

        {/* Stats Section */}
        <Col xs={4} className="stats-section text-center">
          <div className="stats-item">
            <p className="large-font">{numPosts}</p>
            <p>Posts</p>
          </div>
          <div className="stats-item">
            <p className="large-font">{numFollowers}</p>
            <p>
              <Link href="/profile/followers">Followers</Link>
            </p>
          </div>
          <div className="stats-item">
            <p className="large-font">{numFollowing}</p>
            <p>
              <Link href="/profile/following">Following</Link>
            </p>
          </div>
        </Col>

        {/* Bio Section */}
        {profile.about && (
          <Col xs={4} className="bio-section text-center">
            <p>{profile.about}</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
