import { useEffect, useState, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { DEVICE_SIZES } from "react-bootstrap/esm/createUtilityClasses";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import 'github-markdown-css'
import { QUESTION_URL } from "../../constants";


function QuestionEditor(props) {
    const question = props.question ? props.question : { "id": "", "title": "", "difficulty": "", "description": "" };
    const [desc, setDesc] = useState(question.description);
    
    // This block of code is used to autoscroll preview as the description grows longer
    const descEndRef = useRef(null);
    const scrollToBottom = () => {
        descEndRef.current.scrollIntoView({
            behavior: "smooth",
        });
    }
    useEffect(() => scrollToBottom, [desc]);

    // When form is submitted.
    const handleSubmit = (event) => {
        event.preventDefault();
        const id = event.target.id.value;
        const title = event.target.title.value;
        const difficulty = event.target.difficulty.value;
        const description = event.target.description.value;

        // New question or existing question
        const submitUrl = id === "" ? QUESTION_URL : QUESTION_URL + "id";
    }


    return <Form onSubmit={handleSubmit}>
        <input type="hidden" value={question.id}/>
        <Row>
            <Col md={6}>
                <Form.Group>
                    <Form.Label><strong>Title</strong></Form.Label>
                    <Form.Control type="text" name="title" placeholder="Enter a question title" />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group>
                    <Form.Label><strong>Difficulty</strong></Form.Label>
                    <Form.Control type="text" name="difficulty" placeholder="Select a difficulty" />
                </Form.Group>
            </Col>
        </Row>
        <br/>
        <Row>
            <Col md={6}><Form.Label><strong>Description</strong></Form.Label></Col>
            <Col md={6}><Form.Label><strong>Preview</strong></Form.Label></Col>
        </Row>
        <Row>
            <Col md={6}>
                <Form.Group>
                    <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        name="description"
                        style={{ height: '200px' }}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
                <div className="desc-preview-container markdown-body" >
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} style={{"width": "100%"}}>{desc}</ReactMarkdown>
                    <div className="scroll-dummy" ref={descEndRef}/>
                </div>
            </Col>
        </Row>
        <br/>
        <Button variant="dark" type="submit">
            Submit
        </Button>
    </Form>;
}

export default QuestionEditor;