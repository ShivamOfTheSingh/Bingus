"use client";

import { UserProfile } from "@/lib/db/models";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Following } from "@/lib/db/models";
import FollowButton from "./FollowButton";
import Image from "next/image";
import profilePicTemp from "@/public/profile-pic-temp.jpg";

interface ProfilePageInfoOtherProps {
    profile: UserProfile;
    numPosts: number;
    following: Following;
    numFollowers: number;
    numFollowing: number;
    className?: string;
}

export default function ProfilePageInfoOther({ profile, numPosts, following, numFollowers, numFollowing, className }: ProfilePageInfoOtherProps) {
    return (
        <Container className={`${className} py-4`}>
            <Row className="justify-content-center">
                {/* Profile Picture */}
                <Col xs={12} md={4} className="text-center mb-4">
                    <Image
                        src={profilePicTemp}
                        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                        alt={`${profile.username}'s profile`}
                    />
                </Col>

                {/* User Info */}
                <Col xs={12} md={8} className="text-center text-md-left">
                    <div className="text-2xl font-semibold">{profile.firstName} {profile.lastName}</div>
                    <div>{profile.username}</div>
                    <Button variant="outline-secondary" size="sm" className="mb-2">
                        Edit Profile
                    </Button>

                    <FollowButton following={following} />

                    {/* Stats */}
                    <Row className="justify-content-center justify-content-md-start my-3">
                        <Col xs={4} className="text-center">
                            <strong>{numPosts}</strong>
                            <p>Posts</p>
                        </Col>
                        <Col xs={4} className="text-center">
                            <strong>{numFollowers}</strong>
                            <p>Followers</p>
                        </Col>
                        <Col xs={4} className="text-center">
                            <strong>{numFollowing}</strong>
                            <p>Following</p>
                        </Col>
                    </Row>

                    {/* Bio */}
                    <p>{profile.about}</p>
                </Col>
            </Row>
        </Container>
    );
}