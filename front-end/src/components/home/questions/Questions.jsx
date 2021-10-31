import React from "react";
import Row from 'react-bootstrap/Row'
import QuestionCard from "./QuestionCard";
import '../../../css/Questions.css'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

function Questions(props) {
    return (
        <>
            <h3>Questions</h3><br />
            <Tabs defaultActiveKey="easy" className="mb-3 questions-difficulty-tabs">
                <Tab eventKey="easy" title="Easy" tabClassName="text-success">
                    <div className="home-questions-wrapper">
                        {props.questions.filter(question => question.difficulty === "easy").map(question => {
                            return (
                                <Row key={question._id}>
                                    <QuestionCard {...question} />
                                </Row>
                            )
                        })}
                    </div>
                </Tab>
                <Tab eventKey="medium" title="Medium" tabClassName="text-warning">
                    <div className="home-questions-wrapper">
                        {props.questions.filter(question => question.difficulty === "medium").map(question => {
                            return (
                                <Row key={question._id}>
                                    <QuestionCard {...question} />
                                </Row>
                            )
                        })}
                    </div>
                </Tab>
                <Tab eventKey="hard" title="Hard" tabClassName="text-danger">
                    <div className="home-questions-wrapper">
                        {props.questions.filter(question => question.difficulty === "hard").map(question => {
                            return (
                                <Row key={question._id}>
                                    <QuestionCard {...question} />
                                </Row>
                            )
                        })}
                    </div>
                </Tab>
            </Tabs>
        </>
    )
}

export default Questions;