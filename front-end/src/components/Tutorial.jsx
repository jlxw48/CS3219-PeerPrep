import ReactMarkdown from "react-markdown";
import { Col, Container, Row } from "react-bootstrap";
import '../css/Tutorial.css'

const markdown = `# How to use PeerPrep 😀

## Signing up

Signing up is easy, just visit the [register](/register) page.
`;

function Tutorial() {
    return (
        <Container className="tutorial-container">
            <Row className="align-items-centre justify-content-center">
                <Col md={12}>
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </Col>
            </Row>
        </Container>
    );
}

export default Tutorial;