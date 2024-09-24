"use server";
import RegisterForm from "@/components/RegisterForm";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";
import Image from "next/image";
import logo from "@/public/logo.jpg";

export default async function Page() {
  return (
    <div >
    <div >
        <div > 
            <div>
                <h1>Hello sigma</h1>
                <Image src={logo} alt="bingus-logo" width={300} height={300} />
            </div>
            <h1>Sign Up</h1>
            <div >
                <ErrorBoundary errorComponent={Error}>
                    <RegisterForm />
                </ErrorBoundary>
            </div>
        </div>
    </div>
</div>
  );
}