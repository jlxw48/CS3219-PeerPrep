import React from "react";
import Card from 'react-bootstrap/Card';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw'
import DifficultyBadge from "../../DifficultyBadge";
import 'github-markdown-css'

function QuestionCard(props) {
    const question = props.question;
    const trimmedQuestionBody = question.description.length > 300 ? question.description.substring(0, 300) + "..." : question.description 
    return (
        <Card className="home-question-card" onClick={props.onClickFunct}>
            <Card.Body>
                <Card.Title>{question.title + " "}<DifficultyBadge difficulty={question.difficulty}/></Card.Title><br/>
                <div className="markdown-body">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{trimmedQuestionBody}</ReactMarkdown>
                </div>
            </Card.Body>
        </Card>
    )
}

export default QuestionCard;