import React, { useEffect } from "react";
import { useState, useContext } from "react";
import authHeader from "../../auth-header";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../App.js"
import { useHistory } from "react-router-dom";

import { Container, Row, Col } from "react-bootstrap";
import Skeleton from 'react-loading-skeleton';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/ext-language_tools"
import "../../css/Practice.css"
import Seeds from '../../Seeds';
import { MATCH_QUESTION_URL } from "../../Api.js";
import Chat from "./Chat";

function Practice() {
    const history = useHistory();
    const [practiceQuestion, setQuestion] = useState(false);

    let { user, userRef, match, matchRef } = useContext(AppContext);

    useEffect(() => {
        if (matchRef.current === null) {
            history.push({ pathname: '/' });
        }

        if (userRef.current === null) {
            history.push({ pathname: '/' });
            toast.error("You can only practice if you are logged in.");
        } else {
            axios({ method: 'get', url: MATCH_QUESTION_URL, headers: authHeader() }).then(res => {
                setQuestion(res.data.question);
            }, err => {
                toast.error("Error fetching practice quesiton, please try again.");
            });
        }
    }, []);



    const seeds = Seeds();
    return (
        <Container className="practice-container">
            <Row className="practice-container-row">
                <Col md={9} className="question-editor-col">
                    <div className="practice-question-container">

                        <div className="practice-question-body">
                            {
                                practiceQuestion ? <><h2>{practiceQuestion.title}</h2><br />
                                    {practiceQuestion.question}</> : <Skeleton height={"100%"} />
                            }
                        </div>
                    </div>
                    <div className="editor-section-container">
                        <AceEditor
                            placeholder=""
                            mode="python"
                            theme="github"
                            name="editor"
                            fontSize={14}
                            showPrintMargin={false}
                            showGutter={true}
                            height="100%"
                            highlightActiveLine={false}
                            value={``}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 4,
                            }} />
                    </div>
                </Col>
                <Chat />
            </Row>
        </Container>
    )
}

export default Practice