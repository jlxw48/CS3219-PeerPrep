import React from "react";
import Card from 'react-bootstrap/Card';

function DifficultyCard(props) {
    const cardTextMap = { "easy" : "Beginner friendly", "medium" : "More advanced topics", "hard" : "Require expert understanding"}
    return (
        <Card className={"difficulty-card " + props.difficulty} onClick={props.onClick}>
            <Card.Body>
                <Card.Title>{props.difficulty}</Card.Title><br/>
                <Card.Subtitle className="text-muted">{cardTextMap[props.difficulty]}</Card.Subtitle>
            </Card.Body>
        </Card>
    )
}

export default DifficultyCard;