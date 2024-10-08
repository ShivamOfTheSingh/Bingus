"use client";

import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useState } from 'react';
import loginUserSchema from '@/lib/form_schemas/loginFormSchema';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ApiError from '@/lib/errors/ApiError';

interface LoginValidateErrors {
    email: string | null,
    password: string | null,
}

export default function LoginForm() {
    // State for each field
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Pending submit state
    const [pending, setPending] = useState(false);
    // Validate form errors state
    const [validateErrors, setValidateErrors] = useState<LoginValidateErrors>({
        email: null,
        password: null
    });
    // Invalid data error
    const [invalid, setInvalid] = useState(false);

    async function onSubmit() {
        setPending(true);
        setInvalid(false);
        setValidateErrors({
            email: null,
            password: null
        });
        const validateFields = loginUserSchema.safeParse({
            email: email,
            password: password
        });
        if (!validateFields.success) {
            const errors = validateFields.error.format();
            setValidateErrors({
                email: errors.email?._errors[0] || null,
                password: errors.password?._errors[0] || null,
            });
            setPending(false);
        }
        else {
            const response = await fetch("https://damian-codecleanup.d3drl1bcjmxovs.amplifyapp.com//api/session/login", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            if (response.status === 404 || response.status === 401) {
                setPending(false);
                setInvalid(true);
            }
            else if (response.status === 200) {
                redirect("/");
            }
            // Unhandled error response from API - throw Error so page redirects to error page
            else {
                throw new ApiError("What the Bingus? An error occured.", response.status);
            }
        }
    }

    return (
        <Form action={onSubmit} className="flex flex-col gap-2 bg-white p-3 border-[#8f6ccc] border-solid border-3 rounded">
            <Form.Label className="text-4xl font-semibold">
                Welcome to Bingus
            </Form.Label>
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
            <Form.Group controlId="submit" className="flex justify-center flex-col">
                <Button variant="primary" type="submit" disabled={pending} className="flex justify-center">
                    {pending ? <div className="flex gap-2 items-center"><Spinner size="sm" animation="border" />Submitting...</div> : "Login"}
                </Button>
                {invalid ? <Form.Label className="text-red-600">Email and/or password is incorrect.</Form.Label> : null}
            </Form.Group>
            <div>
                Don&apos;t have an account? <Link href="/register" className="text-[#8f6ccc]">Register</Link>
            </div>
        </Form>
    );
}