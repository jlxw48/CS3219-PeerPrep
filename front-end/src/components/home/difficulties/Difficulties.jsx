import React from "react";
import DifficultyCard from "./DifficultyCard";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../../css/Difficulties.css'


function Difficulties(props) {
    const difficulties = ["easy", "medium", "hard"];
    return (
        <>
            <br/>
            <h3>Difficulties</h3>
            <br/>
            <Row>
                {difficulties.map(difficulty => {
                    return (<Col md={4} key={difficulty} className="difficulty-card-container">
                        <DifficultyCard difficulty={difficulty} onClick={() => {
                            props.setMatchDifficulty(difficulty);
                            props.setShowMatchModal(true);
                        }
                         } />
                    </Col>)
                })}
            </Row>
        </>
    )
}

export default Difficulties;