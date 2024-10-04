import React from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { UserProfile } from "@/lib/models";

interface ProfilePageInfoProps {
  profile: UserProfile;
  numPosts: number;
  className?: string;
}

const ProfilePageInfo: React.FC<ProfilePageInfoProps> = ({
  profile,
  numPosts,
  className,
}) => {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        {/* Profile Picture */}
        <Col xs={12} md={4} className="text-center mb-4">
          <Image
            src={profile.profilePicture}
            roundedCircle
            style={{ width: "150px", height: "150px" }}
            alt={`${profile.username}'s profile`}
          />
        </Col>

        {/* User Info */}
        <Col xs={12} md={8} className="text-center text-md-left">
          <h2>{profile.username}</h2>
          <Button variant="outline-secondary" size="sm" className="mb-2">
            Edit Profile
          </Button>

          {/* Stats */}
          <Row className="justify-content-center justify-content-md-start my-3">
            <Col xs={4} className="text-center">
              <strong>{numPosts}</strong>
              <p>Posts</p>
            </Col>
            <Col xs={4} className="text-center">
              <strong>1000</strong>
              <p>Followers</p>
            </Col>
            <Col xs={4} className="text-center">
              <strong>0</strong>
              <p>Following</p>
            </Col>
          </Row>

          {/* Bio */}
          <p>{profile.about}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePageInfo;
