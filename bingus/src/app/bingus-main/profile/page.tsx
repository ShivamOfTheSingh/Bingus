"use server";
import NavBar from "@/components/NavBar";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";
import Image from "next/image";
import background from "@/public/bingusBackground.png";
import { Col, Container, Row } from "react-bootstrap";
import NewPostForm from "@/components/NewPostForm";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/objectEncryption";
import pool from "@/lib/pool";
import { Post, UserProfile, Media } from "@/lib/models";

export default async function Page() {

  // async function getMedia(postId: number | undefined) {
  //   const res = await fetch(`http://localhost:3000/api/posts/media/${postId}`);
  //   const json = await res.json();
  //   const arr: Media[] = json.map((m: any) => {
  //     const media: Media = {
  //       mediaId: m.media_id,
  //       postId: m.post_id,
  //       mediaUrl: Buffer.from(m.media_url)
  //     };
  //     return media;
  //   });
  //   return arr;
  // }


  const session = cookies().get("session");
  if (session) {
    const sessionJson = JSON.parse(decrypt(session.value));
    const client = await pool.connect();
    const userIdResult = await client.query("SELECT user_id FROM user_auth WHERE user_auth_id = $1", [sessionJson.userAuthId]);
    const userId = userIdResult.rows[0].user_id;

    const resProfile = await fetch(`http://localhost:3000/api/user_profile/${userId}`);
    const jsonProfile = await resProfile.json();
    const profile: UserProfile = {
      userId: jsonProfile[0].user_id,
      username: jsonProfile[0].user_name,
      email: jsonProfile[0].email,
      firstName: jsonProfile[0].first_name,
      lastName: jsonProfile[0].last_name,
      gender: jsonProfile[0].gender,
      birthDate: jsonProfile[0].birth_date,
      about: jsonProfile[0].about,
      profilePicture: jsonProfile[0].profile_pic
    }

    const resPosts = await fetch(`http://localhost:3000/api/user_profile/posts/${userId}`);
    const jsonPosts = await resPosts.json();
    const posts: Post[] = jsonPosts.map((p: any) => {
      return {
        postId: p.post_id,
        userId: p.user_id,
        caption: p.caption,
        datePosted: p.date_posted
      }
    });

    // const media: { postId: number | undefined; media: Media[] }[] = [];
    
    // posts.forEach(async (p: Post) => {
    //   const m: Media[] = await getMedia(p.postId);
    //   media.push({
    //     postId: p.postId,
    //     media: m
    //   });
    // });

    // console.log("Media", media);

    return (
      <div className="flex justify-center items-center">
        <div>
          {posts.map((p: Post) => {
            return (
              <div>
                {p.postId}
                {p.caption}
              </div>
            );
          })}
        </div>
        <NewPostForm />
      </div>
    );
  }
}
