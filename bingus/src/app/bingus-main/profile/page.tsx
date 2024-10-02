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
import { UserProfile } from "@/lib/models";

export default async function Page() {
  const session = cookies().get("session");
  if (session) {
    const sessionJson = JSON.parse(decrypt(session.value));
    const client = await pool.connect();
    const userIdResult = await client.query("SELECT user_id FROM user_auth WHERE user_auth_id = $1", [sessionJson.userAuthId]);
    const userId = userIdResult.rows[0].user_id;

    const res = await fetch(`http://localhost:3000/api/user_profile/${userId}`);
    const json = await res.json();
    const profile: UserProfile = {
      userId: json[0].user_id,
      username: json[0].user_name,
      email: json[0].email,
      firstName: json[0].first_name,
      lastName: json[0].last_name,
      gender: json[0].gender,
      birthDate: json[0].birth_date,
      about: json[0].about,
      profilePicture: json[0].profile_pic
    }

    return (
      <div className="flex justify-center items-center">
        <div>
          {profile.userId}
        </div>
        <NewPostForm />
      </div>
    );
  }
}
