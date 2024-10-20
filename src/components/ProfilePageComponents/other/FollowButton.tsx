"use client";

import { Following } from "@/lib/db/models";
import { useState } from "react";
import { Button } from "react-bootstrap";
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
        try {
            setLoading(true);

            // follow
            if (!followingStatus) {
                const response = await fetch("http://localhost:3000/api/crud/followings", {
                    method: "POST",
                    body: JSON.stringify(followingObject)
                });

                if (response.status !== 201) {
                    throw new ApiError("What the Bingus? An error occured.", 500);
                }

                const json = await response.json();
                const followingId = json.followingId;
                setLoading(false);
                setFollowingObject((prev: Following) => {
                    return {
                        followingId: followingId,
                        userId: prev.userId,
                        followedUserId: prev.followedUserId
                    };
                });
                setFollowingStatus(true);
            }
            // unfollow
            else {
                const response = await fetch("http://localhost:3000/api/crud/followings", {
                    method: "DELETE",
                    body: JSON.stringify({
                        id: followingObject.followingId
                    })
                });

                if (response.status !== 200) {
                    throw new ApiError("What the Bingus? An error occured.", 500);
                }

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
        catch (error: any) {
            console.log(error);
            throw new ApiError("What the Bingus? An error occured.", 500);
        }
    }

    return (
        <Button variant={followingStatus ? "secondary" : "primary"} className={className} onClick={onClick}>
            {loading ? "Loading..." : followingStatus ? "Unfollow" : "Follow"}
        </Button>
    );
}