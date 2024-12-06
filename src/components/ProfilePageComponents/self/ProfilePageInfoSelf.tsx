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

export default function ProfilePageInfoSelf({ profile, numPosts, numFollowers, numFollowing, settings, className }: ProfilePageInfoSelfProps) {
    return (
        <Container className={`${className} py-4 custom-container`} > {/* Adjust margin for the vertical navbar */}
            <Row className="justify-content-center">
                {/* Profile Picture */}
                <Col xs={12} md={4} className="text-center mb-4">
                    <Image
                        src={profile.profilePicture || profilePicTemp} // Fallback to a temporary image if none provided
                        alt={`${profile.username}'s profile`}
                        width={200} height={200} className="rounded-circle"
                    />
                </Col>
                {/* User Info */}
                <Col xs={12} md={8} className="text-center text-md-left">
                  <div className="text-2xl font-semibold">{settings.showName ? profile.firstName + "  " + profile.lastName : profile.username}</div>
                  <div className="italic">{settings.showName ? profile.username : null}</div>
                  <Button variant="outline-secondary" size="sm" className="mb-2">
                    <Link href="/profile/settings">Edit Profile</Link>
                  </Button>

                  {/* Stats */}
                  <Row className="justify-content-center justify-content-md-start my-3">
                    <Col xs={4} className="text-center">
                      <strong className="large-font">{numPosts}</strong>
                      <p className="large-font">Post(s)</p>
                    </Col>
                    <Col xs={4} className="text-center">
                      <strong className="large-font">{numFollowers}</strong>
                      <Link href="/profile/followers" className="large-font-link">Followers</Link>
                    </Col>
                    <Col xs={4} className="text-center">
                      <strong className="large-font">{numFollowing}</strong>
                      <Link className="large-font-link" href="/profile/following">Following</Link>
                    </Col>
                  </Row>

                    {/* Bio */}
                    <p className="bio">{profile.about}</p>
                </Col>
            </Row>
        </Container>
    );