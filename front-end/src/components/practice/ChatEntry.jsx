import React from "react";
import { Row } from "react-bootstrap";

function ChatEntry(props) {
    return(
        <Row className={props.isSelf ? "chat-entry self" : "chat-entry friend" }>
            <b className="sender-name">{props.senderName}</b>
            <p className="chat-time text-muted">{props.time}</p>
            <div className="chat-bubble">
                {props.text}
            </div>
        </Row>
    )
}

export default ChatEntry;