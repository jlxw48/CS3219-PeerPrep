import { useEffect, useState, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import 'github-markdown-css'
import { QUESTION_URL } from "../../constants";
import axios from "axios";
import { toast } from "react-toastify";


function QuestionEditor(props) {
    const question = props.question;
    const [id, setId] = useState(question._id);
    const [desc, setDesc] = useState(question.desc);
    const [title, setTitle] = useState(question.title);
    const [difficulty, setDifficulty] = useState(question.difficulty);

    useEffect(() => {
        const newQuestion = props.question
        setDesc(newQuestion.description);
        setId(newQuestion["_id"]);
        setTitle(newQuestion.title);
        setDifficulty(newQuestion.difficulty);
    }, [props])
    
    // This block of code is used to autoscroll preview as the description grows longer
    const descEndRef = useRef(null);
    const scrollToBottom = () => {
        if (descEndRef.current === null) {
            return;
        }
        descEndRef.current.scrollIntoView({
            behavior: "smooth",
        });
    }
    useEffect(() => scrollToBottom, [desc]);

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
            props.setEditedQn(null);
            props.fetchQuestions();
            if (isNewNotUpdate) {
                toast.success("Successfully created new question.");
            } else {
                toast.success("Successfully updated question");
            }
        }).catch(err => console.log("Failed to submit question details"));
    }


    return (
    <>
    <Form onSubmit={handleSubmit}>
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
        <Row>
            <Col md={6}>
                <Form.Group>
                <Form.Label><strong>Description</strong></Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Enter a description for the question"
                        name="description"
                        style={{ height: '300px' }}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Label><strong>Preview</strong></Form.Label>
                <div className="desc-preview-container markdown-body" >
                    <ReactMarkdown linkTarget="_blank" remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} style={{"width": "100%"}}>{desc}</ReactMarkdown>
                    <div className="scroll-dummy" ref={descEndRef}/>
                </div>
            </Col>
        </Row>
        <br/>
        <Button variant="dark" type="submit" className="submit-btn">
            Submit
        </Button>
        <Button variant="light" onClick={() => props.setEditedQn(null)}>Cancel</Button>
    </Form>
    </>);
}

export default QuestionEditor;