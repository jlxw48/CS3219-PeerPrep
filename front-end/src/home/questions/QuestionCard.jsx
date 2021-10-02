import React from "react";
import Card from 'react-bootstrap/Card';
import DifficultyBadge from "../../DifficultyBadge";

// Props: {qn_num, title, difficulty, question}
function QuestionCard(props) {
    const trimmedQuestionBody = props.question.length > 300 ? props.question.substring(0, 300) + "..." : props.question 
    return (
        <Card className="home-question-card">
            <Card.Body>
                <Card.Title>{props.title + " "}<DifficultyBadge difficulty={props.difficulty}/></Card.Title><br/>
                <Card.Text>{trimmedQuestionBody}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default QuestionCard;