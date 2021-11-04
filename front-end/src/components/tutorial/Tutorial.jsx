import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import '../../css/Tutorial.css'
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw'

import markdownText from "./TutorialMd";

function Tutorial() {
    return (
        <Container className="tutorial-container">
            <Row className="align-items-centre justify-content-center">
                <Col md={12}>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdownText}</ReactMarkdown>
                </Col>
            </Row>
        </Container>
    );
}

export default Tutorial;