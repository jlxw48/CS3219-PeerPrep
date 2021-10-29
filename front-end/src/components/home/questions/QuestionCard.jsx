import React from "react";
import Card from 'react-bootstrap/Card';
import DifficultyBadge from "../../../DifficultyBadge";

// Props: {qn_num, title, difficulty, question}
function QuestionCard(props) {
    const trimmedQuestionBody = props.description.length > 300 ? props.description.substring(0, 300) + "..." : props.description 
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