import React from "react";
import Card from 'react-bootstrap/Card';

function DifficultyCard(props) {
    const cardTextMap = { "easy" : "Beginner friendly", "medium" : "More advanced topics", "hard" : "Require expert understanding"}
    return (
        <Card className={"difficulty-card " + props.difficulty}>
            <Card.Body>
                <Card.Title>{props.difficulty}</Card.Title><br/>
                <Card.Text>{cardTextMap[props.difficulty]}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default DifficultyCard;