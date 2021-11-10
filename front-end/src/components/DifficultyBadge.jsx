import React from "react";
import Badge from 'react-bootstrap/Badge'

function DifficultyBadge(props) {
    const badge = {
        "easy" : <Badge pill bg="success" className="difficulty-badge easy">Easy</Badge>,
        "medium" : <Badge pill bg="warning" className="difficulty-badge medium">Medium</Badge>,
        "hard" : <Badge pill bg="danger" className="difficulty-badge hard">Hard</Badge>,
    }
    return badge[props.difficulty];
}

export default DifficultyBadge;