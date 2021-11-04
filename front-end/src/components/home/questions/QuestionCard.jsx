import React from "react";
import Card from 'react-bootstrap/Card';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw'
import DifficultyBadge from "../../DifficultyBadge";

function QuestionCard(props) {
    const trimmedQuestionBody = props.description.length > 300 ? props.description.substring(0, 300) + "..." : props.description 
    return (
        <Card className="home-question-card">
            <Card.Body>
                <Card.Title>{props.title + " "}<DifficultyBadge difficulty={props.difficulty}/></Card.Title><br/>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{trimmedQuestionBody}</ReactMarkdown>
            </Card.Body>
        </Card>
    )
}

export default QuestionCard;