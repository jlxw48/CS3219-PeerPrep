import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../css/Practice.css"
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/ext-language_tools"
import Seeds from '../../Seeds';
import ChatEntry from "./ChatEntry";

function Practice() {
    const seeds = Seeds();
    return (
        <Container fluid className="practice-container">
            <Row>
                <Col md={9}>
                    <div className="practice-question-container">
                        <br />
                        <h2>{seeds.practiceQuestion.title}</h2><br />
                        <div className="practice-question-body">
                            {seeds.practiceQuestion.question}
                        </div>
                    </div><br />
                    <div id="editor-container">
                        <AceEditor
                            placeholder=""
                            mode="javascript"
                            theme="github"
                            name="editor-container"
                            fontSize={14}
                            showPrintMargin={false}
                            showGutter={true}
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
                <Col md={3}>
                    <br/>
                    {seeds.chats.map(chat => {
                        return <><ChatEntry {...chat} /><br/></>
                    })}
                </Col>
            </Row>
        </Container>
    )
}

export default Practice