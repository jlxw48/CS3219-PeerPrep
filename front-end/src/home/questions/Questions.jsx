import React from "react";
import Row from 'react-bootstrap/Row'
import QuestionCard from "./QuestionCard";
import '../../css/Questions.css'

function Questions(props) {
    return (
        <div className="home-questions-wrapper">
            <h3>Questions</h3><br/>
            {props.questions.map(question => {
                console.log(question);
                return (
                    <Row key={question.qn_num}>
                        <QuestionCard {...question}/>
                    </Row>
                )
            })}
        </div>
    )
}

export default Questions;