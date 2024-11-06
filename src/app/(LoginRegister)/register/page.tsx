"use server";
import RegisterForm from "@/components/forms/RegisterForm";

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
                    <Col lg={8} className="d-flex align-items-center">
                        <Image src={logo} alt="bingus-logo" width={600} height={683} className="rounded-xl shadow-lg" />
                    </Col>
                    <Col lg={4} className="d-flex align-items-center">
                        <div>
                            <RegisterForm />
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="absolute z-[-1] opacity-50">
                <Image src={background} alt="background-img" width={900} height={900} id="bg-image" style={{ filter: 'saturate(4) hue-rotate(-100deg) brightness(1.1)' }}/>
            </div>
        </div>
    );
}