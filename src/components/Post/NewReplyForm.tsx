"use client";

import { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import commentReplyFormSchema from "@/lib/form_schemas/commentReplyFormSchema";
import { CommentReply } from "@/lib/db/models";
import ApiError from "@/lib/errors/ApiError";

interface NewPostFormProps {
    onSubmitDecorator: (reply: CommentReply) => void;
    commentId: number;
    className?: string;
}

interface NewPostValidateErrors {
    reply: string | null;
}

export default function NewReplyForm({ onSubmitDecorator, commentId, className }: NewPostFormProps) {

    const [pending, setPending] = useState<boolean>(false);
    const [reply, setReply] = useState<string>("");

    const [validateErrors, setValidateErrors] = useState<NewPostValidateErrors>({
        reply: null
    });

    async function onSubmit() {
        setPending(true);
        setValidateErrors({
            reply: null
        });

        const validateFields = commentReplyFormSchema.safeParse({
            reply: reply
        });

        if (!validateFields.success) {
            const errors = validateFields.error.format();
            setValidateErrors({
                reply: errors.reply?._errors[0] || null
            });
            setPending(false);
        }
        else {
            const newReply: CommentReply = {
                postCommentId: commentId,
                reply: reply,
                dateReplied: new Date()
            };

            const response = await fetch("https://production.d3drl1bcjmxovs.amplifyapp.com/api/crud/comment_reply", {
                method: "POST",
                body: JSON.stringify(newReply)
            });

            if (response.status === 201) {
                const { commentReplyId } = await response.json();
                newReply.commentReplyId = commentReplyId;
                setPending(false);
                setReply("");
                onSubmitDecorator(newReply);
            }
            else {
                throw new ApiError("An unexpected error occured", response.status);
            }
        }
    }

    return (
        <Form action={onSubmit}>
            <Form.Group controlId="reply">
                <Form.Control type="text"
                    placeholder="Write a reply..."
                    value={reply} onChange={(e) => { setReply(e.target.value) }}
                    disabled={pending}
                />
                {validateErrors.reply ? (
                    <Form.Label>
                        {validateErrors.reply}
                    </Form.Label>
                ) : null}
            </Form.Group>
            <Button type="submit">
                {pending ?
                    <div className="flex gap-2 items-center">
                        <Spinner size="sm" animation="border" />
                        Submitting...
                    </div>
                    : "Submit"
                }
            </Button>
        </Form>
    );
}