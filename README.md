# Bingus Code Guidelines

# Table of Contents
#### Models
#### API Routes
#### API Requests from Frontend
#### Forms
#### Working with Media objects

## Models
### All DB Tables will have their corresponding typescript interface defined in @/lib/db/models.ts
### Use them for type checking throughout the app
```ts
export interface UserProfile {
    userId?: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: Date;
    about?: string;
    profilePicture?: string;
}

export interface UserAuth {
    userAuthId?: number;
    password: string;
    dateRegistered: Date;
    userId: number;
}

export interface UserSession {
    sessionId?: number;
    publicSessionId: string;
    expiresAt: Date;
    userAuthId: number;
    logoutAt?: Date;
}

export interface Post {
    postId?: number;
    userId?: number;
    caption: string;
    datePosted: Date;
}

export interface Media {
    mediaId?: number;
    postId: number;
    mediaUrl: string;
}

export interface CommentReply {
    commentReplyId?: number;
    postCommentId: number;
    userId?: number;
    reply: string;
    dateReplied: Date;
}

export interface CommentVote {
    commentVoteId?: number;
    postCommentId: number;
    userId?: number;
    commentVoteValue: boolean;
}

export interface Following {
    followingId?: number;
    userId?: number;
    followedUserId: number;
}

export interface PostComment {
    postCommentId?: number;
    postId: number;
    userId?: number;
    postComment: string;
    dateCommented: Date;
}

export interface PostVote {
    postVoteId?: number;
    postId: number;
    userId?: number;
    postVoteValue: boolean;
}

export interface UserSettings {
    userSettingsId?: number;
    userId?: number;
    showName: boolean;
    profilePublic: boolean;
}
```

## API Routes
### Checklist for API Routes
#### 1. Always use interfaces defined in models.ts to type check
```ts
import { Post } from "@/lib/db/models";

const posts: Post[] = result.rows.map((row: any) => (
    {
        postId: row.post_id,
        userId: row.user_id,
        caption: row.caption,
        datePosted: new Date(row.date_posted)
    }
));
return new Response(JSON.stringify(posts), { status: 200 });
```
#### 2. Import pool from @/lib/db/pool.ts to connect to DB
```ts
import pool from "@/lib/db/pool";
```
#### 3. Define client outside of the try/catch block and release it in the finally block
```ts
let client;
try {
    client = await pool.connect();
    const result = await client.query("....");
    //....
}
catch (error) {
    //....
}
finally {
    if (client) {
        client.release();
    }
}
```
#### 4. For non-GET requests, first authenticate the session by getting the user ID using @/lib/cookies/getCurrentSessionUserId.ts. If not authenticated, return 401
##### POST and PUT format
```ts
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

const userId = await getCurrentSessionUserId();
if (userId === -1) {
    return new Response("Unauthorized API call", { status: 401 });
}
```
##### DELETE format
```ts
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

const { id } = await request.json();
const userId = await getCurrentSessionUserId();
if (userId === -1 || userId !== id) {
    return new Response("Unauthorized API call", { status: 401 });
}
```
#### 5. If an unexpected error occurs, catch it in catch block and reutrn 500
```ts
catch (error) {
    return new Response("Failed to delete data", { status: 500 });
}
```
#### 6. If you're writing a GET endpoint by id, get the id from route params. Check for empty result and return a 404 if empty
```ts
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    //....
    try {
        const id = parseInt(params.id);

        //....

        if (result.rows.length === 0) {
            return new Response("Post record not found", { status: 404 });
        }

        //....
    } 
    catch (error) {
        //....
    }
    finally {
        //....
    }
}
```
## API Requests from Frontend
### GET Requests
### GET Requests are often a combination or multiple API calls, if the page requires a lot of different data
### Checklist for making GET requests
#### 1. Create a new function in @/lib/GET_api_calls
```ts
export default async function getProfilePageData(userId: number): Promise<ReturnData> {}
```
#### 2. As always, use interfaces from @/lib/db/models.ts for type checkibng
```ts
import { UserProfile, Post, Media } from "../db/models";
```
#### 3. In the same file, define an interface to tell you what the returned data format will be
```ts
interface ReturnData {
  profile: UserProfile;
  numPosts: number;
  posts: { post: Post, media: Media[] }[];
}
```
#### 4. Make each API request sequentially, type checking the response object, and building the return object correctly
```ts
const resProfile = await fetch(`http://localhost:3000/api/crud/user_profile/${userId}`);
const profile: UserProfile = await resProfile.json();

const resPosts = await fetch(`http://localhost:3000/api/crud/user_profile/posts/${userId}`);
const posts: Post[] = await resPosts.json();

const postsWithMedia: { post: Post, media: Media[] }[] = [];
for (let i = 0; i < posts.length; i++) {
    const resMedia = await fetch(`http://localhost:3000/api/crud/posts/media/${posts[i].postId}`);
    const mediaArray: Media[] = await resMedia.json();
    postsWithMedia.push({
        post: posts[i],
        media: mediaArray
    });
}
```
#### 5. Whenever you GET a single object by ID (like UserProfile in this example), add a 404 check and call next.js's notFound() if you get a 404
```ts
import { notFound } from "next/navigation";

export default async function getProfilePageData(userId: number): Promise<ReturnData> {
    const resProfile = await fetch(`http://localhost:3000/api/crud/user_profile/${userId}`);
    if (resProfile.status === 404) notFound(); // Here
    const profile: UserProfile = await resProfile.json();
    //....
}
```
#### 6. After you get all the data, return the correct object corresponding to your interface
```ts
return {
  profile: profile,
  numPosts: posts.length,
  posts: postsWithMedia
};
```
#### 7. Once the GET function is ready, you can call it in the page.tsx. If it's a page that requires a logged in user (like this example), check for that first to get the user ID. Return the SessionInactive component from @/components/SessionInactive if not validated
```ts
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import SessionInactive from "@/components/SessionInactive";

export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
      return <SessionInactive />;
    }

    //....
}
```
#### 8. If session is validated, call the appropriate get function and do whatever you need with the data
```ts
import getProfilePageData from "@/lib/GET_api_calls/getProfilePageData"

export default async function Page() {
    //....

    const pageData = await getProfilePageData(userId);
    return (
        //....
    );
}
```
### POST, PUT, or DELETE Requests
#### These requests are done through forms, refer to Forms secition of this doc

## Forms
### Checklist for forms
#### 1. Define a new schema for the form with zod. Make a new file in @/lib/formSchemas. ChatGPTing JUST this part has been working pretty well so far
```ts
import { z } from "zod";

const loginUserSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),
  
    password: z
      .string()
      .min(1, "Password is required")
  });

export default loginUserSchema;
```
#### 2. Create the form component in @/components/forms. Use the bootstrap Form component. Each field is a Form.Group components containg a Form.Label and Form.Control of the correct type. The last one is a Form.Group with a submit Button in it
```ts
"use client";

import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";

export default function LoginForm() {
    return (
        <Form action={onSubmit}>
            <Form.Label>
                Welcome to Bingus
            </Form.Label>
            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="submit">
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form.Group>
            <div>
                Don't have an account? <Link href="/register" className="text-[#8f6ccc]">Register</Link>
            </div>
        </Form>
    );
}
```
#### 4. Add a React state for each field, and a pending state
```ts
import { useState } from 'react';

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);

    //....
}
```
#### 5. Connect the each field to its state - Have the value and onChange attributes set up for each and disable them if pending is true. You can have the submit button change on pending state too
```ts
import { useState } from 'react';

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);

    return (
        <Form action={onSubmit}>
            <Form.Label>
                Welcome to Bingus
            </Form.Label>
            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} disable={pending} />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} disabled={pending} />
            </Form.Group>
            <Form.Group controlId="submit">
                <Button variant="primary" type="submit">
                    {pending ? <div className="flex gap-2 items-center"><Spinner size="sm" animation="border" />Submitting...</div> : "Login"}
                </Button>
            </Form.Group>
            <div>
                Don't have an account? <Link href="/register" className="text-[#8f6ccc]">Register</Link>
            </div>
        </Form>
    );
}
```
#### 6. Data validation. Here are the steps of using the previously defined form schema to validate the input.
##### Import the form schema and define an interface for possible errors, as defined by the schema.
```ts
import loginUserSchema from '@/lib/form_schemas/loginFormSchema';

interface LoginValidateErrors {
    email: string | null,
    password: string | null,
}
```
#### Create a new state to hold any errors if they occur, using the defined interface
```ts
const [validateErrors, setValidateErrors] = useState<LoginValidateErrors>({
    email: null,
    password: null
});
```
#### Add an error message to any applicable form groups to display if an error occurs
```ts
<Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} disabled={pending} />
        {validateErrors.email ? <Form.Label className="text-red-600">{validateErrors.email}</Form.Label> : null}
</Form.Group>
<Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} disabled={pending} />
        {validateErrors.password ? <Form.Label className="text-red-600">{validateErrors.password}</Form.Label> : null}
</Form.Group>
```
#### 7. Submitting the form.
#### Here are the steps when it comes to form submission
#### Define the onSubmit function.
```ts
async function onSubmit() {}
```
#### Set pending state to true and clear any validation errors
```ts
async function onSubmit() {
    setPending(true);
    setValidateErrors({
        email: null,
        password: null
    });
}
```
#### Validate the user input with the form schema using zod's safeParse()
```ts
async function onSubmit() {
    //....

    const validateFields = loginUserSchema.safeParse({
        email: email,
        password: password
    });
}
```
#### Check for errors. If present, get the errors, set them in the error state, and set pending back to true
```ts
async function onSubmit() {
    //....

    if (!validateFields.success) {
        const errors = validateFields.error.format();
        setValidateErrors({
            email: errors.email?._errors[0] || null,
            password: errors.password?._errors[0] || null,
        });
        setPending(false);
    }
}
```
#### If no errors, proceed to API calls (POST, PUT, DELETE etc.)
```ts
async function onSubmit() {
    //....

    else {
        const response = await fetch("http://localhost:3000/api/session/login", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
    }
}
```
#### NOTE: This example doesn't use any types from models.ts but if you do, create the type checked object first like
```ts
import { Post } from "@/lib/db/models";

const post: Post = {...};
const response = await fetch("...", {
    method: "...",
    body: JSON.stringify(post) //Stringify the object
});
```
#### Check for any EXPECTED status codes and handle approprietaly
```ts
import { redirect } from 'next/navigation';

async function onSubmit() {
    //....

    else {
        //....

        if (response.status === 404 || response.status === 401) { // Error
                setPending(false);
                setInvalid(true);
        }
        else if (response.status === 200) { // OK
            redirect("/");
        }
    }
}
```
#### Add an extra ELSE to check for any UNEXPECTED status codes. Throw an error in this case (it will be caught by Next.js and our custom error page will dispaly)
```ts
import ApiError from '@/lib/errors/ApiError';
import { redirect } from 'next/navigation';

async function onSubmit() {
    //....

    else {
        //....

        if (response.status === 404 || response.status === 401) { // EXPECTED Error
                setPending(false);
                setInvalid(true);
        }
        else if (response.status === 200) { // OK
            redirect("/");
        }
        else { // UNEXPECTED Error
            throw new ApiError("What the Bingus? An error occured.", response.status);
        }
    }
}
```
## Working with Media objects
### 1. POST Media
#### Convert the file data into a base64 string using @/lib/utils/readFile. The first argument for readFile() is a File object, and the second argument is a function (base64String: string) => void, that will take the file data and do something with it. In this example, the code reads the file and stores the data in a React state, so the arguments passed to readFile are the file, and the setFileData function
```ts
//....
import readFile from "@/lib/utils/readFile";

const [fileData, setFileData] = useState<string>("");
const file: File = new File(); //Assume this file came from somewhere else
readFile(file, setFileData); //This takes the file, decodes it, and calls setFileData(base64String)
```
#### When you have the converted base64File, create a new Media object and use the string as the mediaUrl field. The POST endpoint will take care of the rest
```ts
//....
import readFile from "@/lib/utils/readFile";
import { Media } from "@/lib/db/models";

const [fileData, setFileData] = useState<string>("");
const file: File = new File();
readFile(file, setFileData);

const media: Media = {
    postId: 10, // I put a random number just for the example
    mediaUrl: fileData //From the newly set react state above
};
```
#### Once you have the Media object ready, you can simply POST it with the API call
```ts
//....
import readFile from "@/lib/utils/readFile";
import { Media } from "@/lib/db/models";

const [fileData, setFileData] = useState<string>("");
const file: File = new File();
readFile(file, setFileData);

const media: Media = {
    postId: 10, // I put a random number just for the example
    mediaUrl: fileData //From the newly set react state above
};

const res = await fetch("http://localhost:3000/api/crud/media", {
    method: "POST",
    body: JSON.stringify(media)
});
```
### 2. GET and display Media
#### Whenever you get a Media object from the API, you can just use the mediaUrl field as the image or video source. The page here is just a random example
```ts
"use server";

import { Media } from "@/lib/db/models"l;

export async default function Page() {
    const res = await fetch("http://localhost:3000/api/crud/media/10");
    const media: Media = await res.json();

    return (
        <img src={media.mediaUrl} />
    );
}
```
