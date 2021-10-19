import React from "react";
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../css/Practice.css"
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/ext-language_tools"
import Seeds from '../../Seeds';
import ChatEntry from "./ChatEntry";

function Practice() {
    const seeds = Seeds();
    return (
        <Container className="practice-container">
            <Row className="practice-container-row">
                <Col md={9} className="question-editor-col">
                    <div className="practice-question-container">
                        <div className="practice-question-body">
                            <h2>{seeds.practiceQuestion.title}</h2><br />
                            {seeds.practiceQuestion.question}
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