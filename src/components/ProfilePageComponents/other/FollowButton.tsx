"use client";

import { Following } from "@/lib/db/models";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { followUser} from "@/lib/GET_api_calls/followUser";
import { unfollowUser } from "@/lib/GET_api_calls/followUser";

import ApiError from "@/lib/errors/ApiError";

interface FollowButtonProps {
    following: Following;
    className?: string;
}

export default function FollowButton({following, className }: FollowButtonProps) {
    const [followingObject, setFollowingObject] = useState<Following>(following);
    const [followingStatus, setFollowingStatus] = useState<boolean>(following.followingId !== undefined ? true : false);
    const [loading, setLoading] = useState<boolean>(false);

    async function onClick() {
        
            setLoading(true);
            // follow
            if (!followingObject.followingId) {
                const following: Following = await followUser(followingObject.userId, followingObject.followedUserId);
                setLoading(false);
                setFollowingObject(following);
                setFollowingStatus(true);
            }
            // unfollow
            else {
                await unfollowUser(followingObject.followingId);
                setLoading(false);
                setFollowingObject((prev: Following) => {
                    return {
                        userId: prev.userId,
                        followedUserId: prev.followedUserId
                    };
                });
                setFollowingStatus(false);
            }
    }

    return (
        <Button variant={followingStatus ? "secondary" : "primary"} className={className} onClick={onClick}>
            {loading ? "Loading..." : followingStatus ? "Unfollow" : "Follow"}
        </Button>
    );
}