import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from "react-bootstrap";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import background from "@/public/bingusBackground.png";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
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
      {children}
    </div>
  );
}
