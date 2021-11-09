import React, { useState, useEffect } from "react";
import Row from 'react-bootstrap/Row'
import QuestionCard from "./QuestionCard";
import '../../../css/Questions.css'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import axios from "axios";
import { QUESTION_URL } from '../../../constants';

function Questions(props) {
    const [easy, setEasy] = useState([]);
    const [medium, setMedium] = useState([]);
    const [hard, setHard] = useState([]);
    const validDifficulties = ["easy", "medium", "hard"];
    
    function getSetQuestions(difficulty) {
        if (!validDifficulties.includes(difficulty)) {
            return;
        }

        axios.get(QUESTION_URL, {
            params: {
                difficulty
            }
        }).then(res => res.data.data)
        .then(data => {
            switch (difficulty) {
                case "easy":
                    setEasy(data.questions);
                    break;
                case "medium":
                    setMedium(data.questions);
                    break;
                case "hard":
                    setHard(data.questions);
                default:
                    return;
            }
        }).catch(err => {
            console.error("Error fetching questions for home page.", err);
        });
    }

    useEffect( async () => {
        for (let difficulty of validDifficulties) {
            console.log(difficulty);
            await getSetQuestions(difficulty);
        }
        console.log(easy);
        console.log(medium);
        console.log(hard);
    }, [])


    return (
        <>
            <h3>Questions</h3><br/>
            <Tabs defaultActiveKey="easy" className="mb-3 questions-difficulty-tabs">
                <Tab eventKey="easy" title="Easy" tabClassName="text-success">
                    <div className="home-questions-wrapper">
                        {easy.map(question => {
                            return (
                                <Row key={question._id}>
                                    <QuestionCard question={question} onClickFunct={() => {
                                        props.setQuestionToShow(question);
                                    }}/>
                                </Row>
                            )
                        })}
                    </div>
                </Tab>
                <Tab eventKey="medium" title="Medium" tabClassName="text-warning">
                    <div className="home-questions-wrapper">
                        {medium.map(question => {
                            return (
                                <Row key={question._id}>
                                    <QuestionCard question={question} onClickFunct={() => {
                                        props.setQuestionToShow(question);
                                    }}/>
                                </Row>
                            )
                        })}
                    </div>
                </Tab>
                <Tab eventKey="hard" title="Hard" tabClassName="text-danger">
                    <div className="home-questions-wrapper">
                        {hard.map(question => {
                            return (
                                <Row key={question._id}>
                                    <QuestionCard question={question} onClickFunct={() => {
                                        props.setQuestionToShow(question);
                                    }}/>
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