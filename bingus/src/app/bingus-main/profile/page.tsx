"use server";
import NavBar from "@/components/NavBar";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";
import Image from "next/image";
import background from "@/public/bingusBackground.png";
import { Col, Container, Row } from "react-bootstrap";

export default async function Page() {
  return (
    <div className="w-[100v] h-[100vh] flex items-center justify-center">
      <Container>
        <Row>
          <Col>
            <NavBar />
          </Col>
        </Row>
      </Container>
      <div className="absolute z-[-1] opacity-50">
        <Image
          src={background}
          alt="background-img"
          width={900}
          height={900}
          id="bg-image"
        />
      </div>
    </div>
  );
}
