import ReactMarkdown from "react-markdown";
import { Modal, Button } from "react-bootstrap";
import rehypeRaw from "rehype-raw";
import 'github-markdown-css/github-markdown-light.css'
import "../../../css/QuestionModal.css"

function QuestionModal(props) {
    const question = props.question;

    return (
        <Modal
            show
            size="lg"
            centered
            onHide={() => props.setQuestionToShow(null)}
            className="question-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {question.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="markdown-body">
                    <ReactMarkdown linkTarget="_blank" rehypePlugins={[rehypeRaw]}>{question.description}</ReactMarkdown>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={() => props.setQuestionToShow(null)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default QuestionModal;