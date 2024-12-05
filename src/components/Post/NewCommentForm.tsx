"use client";

import { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import commentFormSchema from "@/lib/form_schemas/commentFormSchema";
import { PostComment } from "@/lib/db/models";
import ApiError from "@/lib/errors/ApiError";
import '@/public/NewCommentForm.css';  

interface NewPostFormProps {
    onSubmitDecorator: (comment: PostComment) => void;
    postId: number;
    className?: string;
}

interface NewPostValidateErrors {
    comment: string | null;
}

export default function NewCommentForm({ onSubmitDecorator, postId, className }: NewPostFormProps) {

    const [pending, setPending] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");

    const [validateErrors, setValidateErrors] = useState<NewPostValidateErrors>({
        comment: null
    });

    async function onSubmit() {
        setPending(true);
        setValidateErrors({
            comment: null
        });

        const validateFields = commentFormSchema.safeParse({
            comment: comment
        });

        if (!validateFields.success) {
            const errors = validateFields.error.format();
            setValidateErrors({
                comment: errors.comment?._errors[0] || null
            });
            setPending(false);
        }
        else {
            const newComment: PostComment = {
                postId: postId,
                postComment: comment,
                dateCommented: new Date()
            };

            const response = await fetch("https://bingus.website/api/crud/post_comment", {
                method: "POST",
                body: JSON.stringify(newComment)
            });

            if (response.status === 201) {
                const { postCommentId } = await response.json();
                newComment.postCommentId = postCommentId;
                setPending(false);
                setComment("");
                onSubmitDecorator(newComment);
            }
            else {
                throw new ApiError("An unexpected error occured", response.status);
            }
        }
    }

    return (
        <Form action={onSubmit} className={`new-comment-form ${className || ''}`}>
            <Form.Group controlId="comment">
                <Form.Control type="text"
                    placeholder="Write a comment..."
                    value={comment} onChange={(e) => { setComment(e.target.value) }}
                    disabled={pending}
                />
                {validateErrors.comment ? (
                    <Form.Label className="form-label">
                        {validateErrors.comment}
                    </Form.Label>
                ) : null}
            </Form.Group>
            <Button type="submit" className="btn-submit">
                {pending ? (
                    <div className="spinner-container">
                        <Spinner size="sm" animation="border" />
                        Submitting...
                    </div>
                ) : "Submit"}
            </Button>
        </Form>
    );
}
