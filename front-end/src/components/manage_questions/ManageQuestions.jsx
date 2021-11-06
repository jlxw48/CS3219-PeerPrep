import { Container, Row, Col, Button } from "react-bootstrap";
import QuestionsTable from "./QuestionsTable";
import QuestionEditor from "./QuestionEditor";
import "../../css/ManageQuestions.css";
import axios from "axios";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { QUESTION_URL, VALIDATE_ADMIN_URL } from "../../constants.js";
import { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import { toast } from "react-toastify";

function ManageQuestions() {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
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
    const isUserAdmin = () => {
        return axios.get(VALIDATE_ADMIN_URL).then(res => true).catch(err => false);
    }
    
    // Check if user is admin then fetch questions
    useEffect(() => {
        isUserAdmin(isAdmin => {
            if (!isAdmin) {
                history.push({ state: "/" });
                toast.error("You have entered an invalid route.");
            }
            fetchQuestions();
            setIsLoading(false);
        });
    }, []);

    return (
        isLoading ? <LoadingScreen /> :
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