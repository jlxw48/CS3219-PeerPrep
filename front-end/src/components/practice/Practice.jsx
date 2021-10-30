import React, { useEffect } from "react";
import { useState, useContext } from "react";
import authHeader from "../../auth-header";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../App.js"
import { useHistory } from "react-router-dom";

import { Container, Row, Col } from "react-bootstrap";
import Skeleton from 'react-loading-skeleton';
import "../../css/Practice.css"
import Seeds from '../../Seeds';
import Chat from "./Chat";
import Editor from "./Editor";

function Practice() {
    const history = useHistory();
    const [practiceQuestion, setQuestion] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    let { user, userRef, match, matchRef } = useContext(AppContext);

    useEffect(() => {
        if (matchRef.current === null) {
            history.push({ pathname: '/' });
            return;
        }

        if (userRef.current === null) {
            history.push({ pathname: '/' });
            toast.error("You can only practice if you are logged in.");
        } else {
            setQuestion(matchRef.current.question);
        }

        setIsLoading(false);
    }, []);

    const seeds = Seeds();
    return (
        isLoading ? <></> : 
        <Container className="practice-container">
            <Row className="practice-container-row">
                <Col md={9} className="question-editor-col">
                    <div className="practice-question-container">

                        <div className="practice-question-body">
                            {
                                practiceQuestion ? <><h2>{practiceQuestion.title}</h2><br />
                                    {practiceQuestion.description}</> : <Skeleton height={"100%"} />
                            }
                        </div>
                    </div>
                    <div className="editor-section-container">
                        <Editor />
                    </div>
                </Col>
                <Chat />
            </Row>
        </Container>
    )
}

export default Practice