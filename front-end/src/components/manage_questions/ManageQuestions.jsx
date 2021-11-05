import { Container, Row, Col, Button } from "react-bootstrap";
import QuestionsTable from "./QuestionsTable";
import QuestionEditor from "./QuestionEditor";
import "../../css/ManageQuestions.css";
import axios from "axios";
import { QUESTION_URL } from "../../constants.js";
import { useEffect, useState } from "react";

function ManageQuestions() {
    const [questions, setQuestions] = useState([]);
    // Question that is currently being edited;
    const [editedQn, setEditedQn] = useState(null);
    const emptyQn = { "_id": "", description: "", title: "", difficulty: ""};
    const fetchQuestions = () => {
        axios.get(QUESTION_URL)
        .then(res => {
            setQuestions(res.data.data.questions);
        })
        .catch(err => console.log("Error fetching questions", err));
    }
    
    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <Container className="manage-questions-container">
            <h1 style={{"display": "inline-block"}}>Questions</h1>{' '}
            <Button variant="info" className="add-question-button" onClick={() => setEditedQn(emptyQn)}>Add question</Button>
            <Row className="questions-table-row">
                <Col md={12}>
                    { questions.length !== 0 ? <QuestionsTable data={questions} setEditedQn={setEditedQn}/> : <></> } 
                    <div style={{"textAlign": "center"}} className="text-muted"><i>Click a row to edit a question.</i></div>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col md={12}>
                    { editedQn !== null ? <QuestionEditor question={editedQn} setEditedQn={setEditedQn} fetchQuestions={fetchQuestions}/> : <></> }
                </Col>
            </Row>
        </Container>
    )
}

export default ManageQuestions;