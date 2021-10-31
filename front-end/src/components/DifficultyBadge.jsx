import React from "react";
import Badge from 'react-bootstrap/Badge'

function DifficultyBadge(props) {
    const badge = {
        "easy" : <Badge pill bg="success">Easy</Badge>,
        "medium" : <Badge pill bg="warning">Medium</Badge>,
        "hard" : <Badge pill bg="danger">Hard</Badge>,
    }
    return badge[props.difficulty];
}

export default DifficultyBadge;