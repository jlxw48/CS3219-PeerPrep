import { useEffect, useState, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import 'github-markdown-css/github-markdown-light.css'
import { QUESTION_URL } from "../../constants";
import axios from "axios";
import { toast } from "react-toastify";
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

function QuestionEditor(props) {
    const question = props.question;
    const [id, setId] = useState(question._id);
    const [desc, setDesc] = useState(question.desc);
    const [title, setTitle] = useState(question.title);
    const [difficulty, setDifficulty] = useState(question.difficulty);
    const formRef = useRef(null);

    useEffect(() => {
        // Set state variables for form fields
        const newQuestion = props.question
        setDesc(newQuestion.description);
        setId(newQuestion["_id"]);
        setTitle(newQuestion.title);
        setDifficulty(newQuestion.difficulty);

        //Focus onto form
        formRef.current.scrollIntoView({
            behavior: "smooth"
        });

    }, [props])
    
    // This block of code is used to autoscroll preview as the description grows longer
    const descEndRef = useRef(null);

    // When form is submitted.
    const handleSubmit = (event) => {
        event.preventDefault();
        // New question or existing question
        const isNewNotUpdate = id === "";
        const submitUrl = isNewNotUpdate ? QUESTION_URL : QUESTION_URL + id;
        const httpReqMethod = isNewNotUpdate ? "post" : "put";

        axios({
            method: httpReqMethod,
            url: submitUrl,
            data: {
                title,
                description: desc,
                difficulty
            }
        }).then(res => {
            props.fetchQuestions();
            if (isNewNotUpdate) {
                toast.success("Successfully created new question.");
            } else {
                toast.success("Successfully updated question");
            }
        }).catch(err => {
            if (err.response) {
                toast.error(err.response.data.data.error_message);
            } else {
                toast.error("Failed to submit the question, please try again later.");
            }
        });
    }

    const handleCancel = () => {
        console.log("scroll up");
        props.setEditedQn(null);
        props.tableRef.current.scrollIntoView({
            behavior: "smooth"
        });
    }


    return (
    <>
    <Form onSubmit={handleSubmit} ref={formRef}>
        <input type="hidden" name="_id" value={id}/>
        <Row>
            <Col md={6}>
                <Form.Group>
                    <Form.Label><strong>Title</strong></Form.Label>
                    <Form.Control name="title" placeholder="Enter a question title" type="text"
                        value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group>
                    <Form.Label><strong>Difficulty</strong></Form.Label>
                    <Form.Select name="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </Form.Select>
                </Form.Group>
            </Col>
        </Row>
        <br/>
        <ScrollSync>
        <Row>
           
            <Col md={6}>
                <Form.Group>
                <Form.Label><strong>Description</strong></Form.Label>
                <ScrollSyncPane>
                    <Form.Control
                        as="textarea"
                        placeholder="Enter a description for the question"
                        name="description"
                        style={{ height: '300px' }}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                    </ScrollSyncPane>
                </Form.Group>
                
            </Col>
            <Col md={6}>
            <Form.Label><strong>Preview</strong></Form.Label>
            <ScrollSyncPane>
                <div className="desc-preview-container markdown-body" >
                    <ReactMarkdown linkTarget="_blank" remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} style={{"width": "100%"}}>{desc}</ReactMarkdown>
                    <div className="scroll-dummy" ref={descEndRef}/>
                </div>
                </ScrollSyncPane>
            </Col>
           
        </Row>
        </ScrollSync>
        <br/>
        <Button variant="dark" type="submit" className="submit-btn">
            Submit
        </Button>
        <Button variant="light" onClick={() => handleCancel()}>Cancel</Button>
    </Form>
    </>);
}

export default QuestionEditor;