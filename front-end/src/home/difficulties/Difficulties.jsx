import React from "react";
import DifficultyCard from "./DifficultyCard";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../css/Difficulties.css'


function Difficulties() {
    return (
        <>
            <br/>
            <h3>Difficulties</h3><br/>
            <Row>
                <Col md={4}>
                    <DifficultyCard difficulty="easy" />
                </Col>
                <Col md={4}>
                    <DifficultyCard difficulty="medium"/>
                </Col>
                <Col md={4}>
                    <DifficultyCard difficulty="hard"/>
                </Col>
            </Row>
        </>
    )
}

export default Difficulties;