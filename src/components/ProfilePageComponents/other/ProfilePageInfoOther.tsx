"use client";

import { UserProfile, UserSettings } from "@/lib/db/models";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import profilePicTemp from "@/public/profile-pic-temp.jpg";
import Link from "next/link";
import '@/public/ProfileInfo.css';

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
  className,
}: ProfilePageInfoOtherProps) {
  return (
    <Container className={`${className} py-4 custom-container`}>
      <Row className="align-items-center">
        {/* Red Section - Profile Image and Name */}
        <Col xs={4} className="profile-section">
          <div className="pfp-info">
            <h2>
              {settings.showName
                ? `${profile.firstName} ${profile.lastName}`
                : profile.username}
            </h2>
            <Image
              src={profile.profilePicture || profilePicTemp}
              alt={`${profile.username}'s profile`}
              width={200}
              height={200}
              className="rounded-circle"
            />
          </div>
        </Col>

        {/* Blue Section - Stats */}
        <Col xs={4} className="stats-section">
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

        {/* Green Section - Bio */}
        {profile.about && (
          <Col xs={4} className="bio-section">
            <p>{profile.about}</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}