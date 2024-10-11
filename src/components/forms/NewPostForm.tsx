"use client";

import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useEffect, useState } from 'react';
import createPostSchema from '@/lib/form_schemas/createPostFormSchema';
import { redirect } from 'next/navigation';
import { Media, Post } from '@/lib/db/models';
import ApiError from '@/lib/errors/ApiError';
import readFile from '@/lib/utils/readFile';


interface NewPostValidateErrors {
    postFiles: string | null,
    postCaption: string | null,
}


export default function NewPostForm() {
    const [postFiles, setPostFiles] = useState<File[]>([]);
    const [postFileData, setPostFileData] = useState<string[]>([]);
    const [postCaption, setPostCaption] = useState("");
    const [redirecting, setRedirecting] = useState(false);
    const [pending, setPending] = useState(false);

    const [validateErrors, setValidateErrors] = useState<NewPostValidateErrors>({
        postFiles: null,
        postCaption: null
    });

    useEffect(() => {
        if (redirecting) {
            redirect("/main/profile");
        }
    }, [redirecting]);

    async function onSubmit() {
        setPending(true);
        setValidateErrors({
            postFiles: null,
            postCaption: null
        });

        const validateFields = createPostSchema.safeParse({
            postFiles: postFiles,
            postCaption: postCaption
        });

        if (!validateFields.success) {
            const errors = validateFields.error.format();
            console.log(errors);
            console.log(postFiles);
            setValidateErrors({
                postFiles: errors.postFiles?._errors[0] || null,
                postCaption: errors.postCaption?._errors[0] || null
            });
            setPending(false);
        }
        else {
            const post: Post = {
                caption: postCaption,
                datePosted: new Date()
            };
            const postResponse = await fetch("https://production.d3drl1bcjmxovs.amplifyapp.com/api/crud/posts", {
                method: "POST",
                body: JSON.stringify(post)
            });
            if (postResponse.status === 201) {
                const postResponseJson = await postResponse.json();
                const postId = postResponseJson.postId;
                
                postFileData.forEach(async (data: string) => {
                    const media: Media = {
                        postId: postId,
                        mediaUrl: data
                    };
                    const mediaResponse = await fetch("https://production.d3drl1bcjmxovs.amplifyapp.com/api/crud/media", {
                        method: "POST",
                        body: JSON.stringify(media)
                    });
                    if (mediaResponse.status !== 201) {
                        throw new ApiError("What the Bingus? An unexpected error occured.", mediaResponse.status); 
                    }
                });

                setPending(false);
                setRedirecting(true);
            }
            else if (postResponse.status === 401) {
                throw new ApiError("Session is ianctive. Please login again.", postResponse.status);
            }
            else {
                throw new ApiError("What the Bingus? An unexpected error occured.", postResponse.status);
            }
        }
    }

    function addFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setPostFiles([...postFiles, e.target.files[0]]);
            readFile(e.target.files[0], (base64String: string) => {
                setPostFileData([...postFileData, base64String]);
            });
            setValidateErrors({
                ...validateErrors,
                postFiles: null
            });
        }
    };

    function removeFile(index: number) {
        const updatedFiles = [...postFiles];
        updatedFiles.splice(index, 1);
        setPostFiles(updatedFiles);
    };

    return (
        <Form action={onSubmit} className="flex flex-col gap-2 bg-white p-3 w-80">
            <Form.Label className="text-4xl font-semibold">
                New Post!
            </Form.Label>
            <Form.Group controlId="formFileMultiple">
                <Form.Label>Please Upload Your Files</Form.Label>
                <Form.Control
                    type="file"
                    multiple
                    onChange={addFile}
                    disabled={pending}
                />
                {validateErrors.postFiles && <Form.Label className="text-red-600">{validateErrors.postFiles}</Form.Label>}

                {/* Display the list of files the user has uploaded */}
                {postFiles.length > 0 && (
                    <ul className="mt-3">
                        {postFiles.map((file, index) => {
                            return (
                                <li key={index} className="flex justify-between items-center">
                                    <span>{file.name}</span>
                                    <Button variant="outline-danger" size="sm" onClick={() => removeFile(index)}>
                                        Remove
                                    </Button>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </Form.Group>
            <Form.Group controlId="postCaption">
                <Form.Label>Post Caption</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={postCaption}
                    onChange={(e) => { setPostCaption(e.target.value); setValidateErrors({ ...validateErrors, postCaption: null }) }}
                    disabled={pending}
                />
                {validateErrors.postCaption ? <Form.Label className="text-red-600">{validateErrors.postCaption}</Form.Label> : null}
            </Form.Group>
            <Form.Group controlId="submit" className="flex justify-end">
                <Button variant="primary" type="submit" disabled={pending}>
                    {pending ? <div className="flex gap-2 items-center"><Spinner size="sm" animation="border" />Submitting...</div> : "Post"}
                </Button>
            </Form.Group>
        </Form>
    );
}
