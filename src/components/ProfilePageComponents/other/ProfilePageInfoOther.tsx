"use client";

import { UserProfile, UserSettings } from "@/lib/db/models";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Following } from "@/lib/db/models";
import FollowButton from "../FollowButton";
import Image from "next/image";
import profilePicTemp from "@/public/profile-pic-temp.jpg";
import Link from "next/link";

interface ProfilePageInfoOtherProps {
    profile: UserProfile;
    numPosts: number;
    following: Following;
    numFollowers: number;
    numFollowing: number;
    settings: UserSettings;
    className?: string;
}

export default function ProfilePageInfoOther({ profile, numPosts, following, numFollowers, numFollowing, settings, className }: ProfilePageInfoOtherProps) {
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
                <div className="text-2xl font-semibold">{settings.showName ? profile.firstName + " " + profile.lastName : profile.username}</div>
                <div>{settings.showName ? profile.username : null}</div>

                    <FollowButton following={following} />

                    {/* Stats */}
                    <Row className="justify-content-center justify-content-md-start my-3">
                        <Col xs={4} className="text-center">
                            <strong>{numPosts}</strong>
                            <p>Posts</p>
                        </Col>
                        <Col xs={4} className="text-center">
                            <strong>{numFollowers}</strong>
                            <Link href={`/profile/followers/${profile.userId}`}>Followers</Link>
                        </Col>
                        <Col xs={4} className="text-center">
                            <strong>{numFollowing}</strong>
                            <Link href={`/profile/following/${profile.userId}`}>Following</Link>
                        </Col>
                    </Row>

                    {/* Bio */}
                    <p>{profile.about}</p>
                </Col>
            </Row>
        </Container>
    );
}