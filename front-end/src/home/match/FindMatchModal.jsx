import React from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal"
import DifficultyCard from "../difficulties/DifficultyCard";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../css/FindMatchModal.css'
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Spinner } from "react-bootstrap";

function FindMatchModal() {
    const [finding, setFinding] = useState(false);

    return (
        <Modal className="find-match-modal" show={true} centered>
            <Modal.Body>
                <div className="find-match-modal-header">Find match?</div><br />
                <Row className="justify-content-center">
                    <Col md="8">
                        <DifficultyCard difficulty="easy" />
                    </Col>
                </Row><br />
                <Row className="justify-content-center">
                    {finding && <FontAwesomeIcon icon={faUserFriends} size="4x" className="match-icon" />}
                    {finding || <Spinner animation="border" />}
                </Row><br />
                <div className="text-center">
                    {finding && <Button variant="dark">Find Match</Button>}
                    {finding || <Button variant="danger">Cancel</Button>}
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default FindMatchModal;