import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../css/Practice.css"
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/ext-language_tools"
import Seeds from '../../Seeds';
import ChatEntry from "./ChatEntry";
import { MATCH_QUESTION_URL } from "../../Api.js";
import authHeader from "../../auth-header";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../App.js"
import { useHistory } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';

function Practice() {
    const history = useHistory();
    const [practiceQuestion, setQuestion] = useState(false);
    
    let { user, userRef } = useContext(AppContext);
    useEffect(() => {
        if (userRef.current === null) {
            history.push({pathname: '/'});
            toast.error("You can only practice if you are logged in.");
        } else {
            axios({method: 'get', url: MATCH_QUESTION_URL, headers: authHeader()}).then(res => {
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
                            mode="javascript"
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
                <Col md={3} className="chat-col">
                    <div className="chat-entry-container">
                        <br />
                        {seeds.chats.map(chat => {
                            return <><ChatEntry {...chat} /><br /></>
                        })}
                    </div>
                    <div className="chat-input-container">
                        <textarea className="chat-input" placeholder="Enter a message..." />
                    </div>

                </Col>
            </Row>
        </Container>
    )
}

export default Practice