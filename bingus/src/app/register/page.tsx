"use server";
import RegisterForm from "@/components/RegisterForm";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";
import Image from "next/image";
import logo from "@/public/logo.jpg";
import background from "@/public/bingusBackground.png";
import "@/public/RegisterFormStyle.css";
import { Col, Container, Row } from "react-bootstrap";

export default async function Page() {
    return (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center">
            <Container>
                <Row>
                    <Col lg={8}>
                        <Image src={logo} alt="bingus-logo" width={600} height={683} className="rounded border-black border-solid border-3" />
                    </Col>
                    <Col lg={4}>
                        <div>
                            <ErrorBoundary errorComponent={Error}>
                                <RegisterForm />
                            </ErrorBoundary>
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="absolute z-[-1] opacity-50">
                <Image src={background} alt="background-img" width={900} height={900} id="bg-image" />
            </div>
        </div>
    );
}