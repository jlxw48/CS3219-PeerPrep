import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../App.js"
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Skeleton from 'react-loading-skeleton';
import Chat from "./Chat";
import Editor from "./Editor";
import LoadingScreen from "../LoadingScreen";
import ReactMarkdown from 'react-markdown'
import rehypeRaw from "rehype-raw";
import 'github-markdown-css/github-markdown-light.css'


import "../../css/Practice.css"
import DifficultyBadge from "../DifficultyBadge.jsx";

function Practice() {
    const history = useHistory();
    const [practiceQuestion, setQuestion] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    let { userRef, matchRef } = useContext(AppContext);

    // If user go to /practice, check if he's logged in and has an existing match.
    useEffect(() => {
        if (userRef.current === null) {
            history.push({ pathname: '/' });
            toast.error("You can only practice if you are logged in.");
        }

        if (matchRef.current === null) {
            console.log(matchRef.current);
            history.push({ pathname: '/' });
            toast.error("Please use the main menu to find a practice partner.");
            return;
        } else {
            setQuestion(matchRef.current.question);
            const minutesLeft = Math.floor(matchRef.current.durationLeft / 60);
            toast.info(`You have ${minutesLeft} minutes remaining for your interview session.`);
        }

        setIsLoading(false);
    }, [userRef, matchRef, history]);

    return (
        isLoading ? <LoadingScreen/> : 
        <Container className="practice-container">
            <Row className="practice-container-row">
                <Col md={12} className="question-editor-col">
                    <div className="practice-question-container">

                        <div className="practice-question-body">
                            {
                                practiceQuestion 
                                    ? <>
                                        <h2>{practiceQuestion.title}&nbsp;<DifficultyBadge difficulty={practiceQuestion.difficulty}/></h2><br />
                                        <div className="markdown-body">
                                            <ReactMarkdown linkTarget="_blank" rehypePlugins={[rehypeRaw]}>{practiceQuestion.description}</ReactMarkdown>
                                        </div>
                                      </> 
                                    : <Skeleton height={"100%"} />
                            }
                        </div>
                    </div>
                    <div className="editor-section-container">
                        <Editor />
                    </div>
                </Col>
            </Row>
            <Chat />
        </Container>
    )
}

export default Practice