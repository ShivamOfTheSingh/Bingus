'use client';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { useEffect, useState } from 'react';
import { createPostSchema, registerUserSchema } from '@/lib/formSchemas';
import { redirect } from 'next/navigation';

import {Post, Media} from '@/lib/models'

import { Alert } from 'react-bootstrap';

import Link from 'next/link';
import ApiError from "@/lib/ApiError";

interface NewPostValidateErrors {
    postFile: string | null,
    postCaption: string | null,
    
 }


export default function NewPostForm() {
    // States for each field
    const [postFile, setPostFile] = useState<File[]>([]); // Change to an array to handle files correctly
    const [postCaption, setPostCaption] = useState("");
    const [redirecting, setRedirecting] = useState(false);

    // Pending submission state
    const [pending, setPending] = useState(false);
    // Success state
    const [success, setSuccess] = useState(false);
    // Validate form errors state
    const [validateErrors, setValidateErrors] = useState<NewPostValidateErrors>({
        postFile: null,
        postCaption: null
    
    });

    useEffect(() => {
        if (redirecting) {
            redirect("/bingus-main/profile");
        }
    }, [redirecting]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault(); // Prevent default form submission
        setPending(true);
        setValidateErrors({
            postFile: null,
            postCaption: null
            
         });
        
        // Validate form data
        const validateFields = createPostSchema.safeParse({
            postFile: postFile,
            postCaption: postCaption
        });

        // Check validation status
      if (!validateFields.success) {
        const errors = validateFields.error.format();
        console.log("Form errors", errors);
        // Set state to display errors if present
        setValidateErrors({
           postFile: errors.postFile?._errors[0] || null,
           postCaption: errors.postCaption?._errors[0] || null
        });
        setPending(false);
      }
      else{ //inputs are valid
        const today = new Date();

        const resultPost = await fetch("http://localhost:3000/api/posts", {method: "POST", body: JSON.stringify({caption: postCaption, datePosted: today.toISOString()}) });
        const jsonPost = await resultPost.json();
        const postId = jsonPost.post_id;

        postFile.map(async (file) => {
            const buffer = await handleFileToBuffer(file); // Convert file to Buffer
            const newMedia: Media = {
                postId: postId,
                mediaUrl: buffer // Buffer here
            };
            
            await fetch("http://localhost:3000/api/media", {
                method: "POST",
                body: JSON.stringify(newMedia)
            });
        });

        // const resultMedia = await fetch("http://localhost:3000/api/media", { method: "POST", {  } });
        console.log("Form submitted successfully", {
            postFile,
            postCaption
        });

        setPending(false);
        setSuccess(true);
        console.log("setting redirecting state to true");
        setRedirecting(true);
      }
      // Handle the form submission logic here (e.g., send form data to the server)
    }

    // Update handle file input to set files as an array of files
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPostFile([...postFile, ...Array.from(e.target.files)]); // Convert FileList to an array of File objects
        }
    };

    // Handle removing a file from the list
    const removeFile = (index: number) => {
        const updatedFiles = [...postFile];
        updatedFiles.splice(index, 1); // Remove the selected file from the array
        setPostFile(updatedFiles); // Update the file array state
    };

    const handleFileToBuffer = async (file: File): Promise<Buffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
    
            // Read the file as an ArrayBuffer
            reader.readAsArrayBuffer(file);
    
            reader.onloadend = () => {
                const buffer = Buffer.from(reader.result as ArrayBuffer); // Convert ArrayBuffer to Buffer
                resolve(buffer);
            };
    
            reader.onerror = reject;
        });
    };


    return (
        <Form onSubmit={onSubmit} className="flex flex-col gap-2 bg-white p-3 w-80">
            <Form.Label className="text-4xl font-semibold">
                New Post!
            </Form.Label>

            <Form.Group controlId="formFileMultiple">
                <Form.Label>Please Upload Your Files</Form.Label>
                <Form.Control
                    type="file"
                    multiple
                    onChange={handleFileChange} // Use handleFileChange for correct file handling
                    disabled={pending}
                />
                {validateErrors.postFile && <Form.Label className="text-red-600">{validateErrors.postFile}</Form.Label>}
                
                {/* Display the list of files the user has uploaded */}
                {postFile.length > 0 && (
                    <ul className="mt-3">
                        {postFile.map((file, index) => {
                            console.log(postFile);
                            return (
                            <li key={index} className="flex justify-between items-center">
                                <span>{file.name}</span>
                                <Button variant="outline-danger" size="sm" onClick={() => removeFile(index)}>
                                    Remove
                                </Button>
                            </li>
                        )})}
                    </ul>
                )}
            </Form.Group>


            <Form.Group controlId="postCaption">
                <Form.Label>Post Caption</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={3} 
                    value={postCaption} 
                    onChange={(e) => { setPostCaption(e.target.value) }}
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