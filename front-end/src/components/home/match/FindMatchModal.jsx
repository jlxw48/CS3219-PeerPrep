import React from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal"
import DifficultyCard from "../difficulties/DifficultyCard";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../../css/FindMatchModal.css'
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Spinner } from "react-bootstrap";
import { FIND_MATCH_URL } from "../../../Api";
import useAPIError from '../../../common/hooks/useApiError'
import axios from 'axios';

function FindMatchModal(props) {
    const { addError } = useAPIError();
    const [finding, setFinding] = useState(false);

    const handleFindMatch = () => {
        setFinding(true);
        axios.get(FIND_MATCH_URL).then(response => {
            if (response.ok) {
                
            } else {
                addError("Failed to find a match. Please try again later.", response.status);
            }
        }).catch((error) => {
            console.log('[error]', error.response);
            addError("Failed to find a match. Please try again later.", "404");
        })
    }

    const handleCancel = () => {
        setFinding(false);
        props.setShowMatchModal(false);
    }
    return (
        <Modal show={props.show} difficulty={props.difficulty} onHide={() => handleCancel()} className="find-match-modal" centered>
            <Modal.Body>
                <div className="find-match-modal-header">Find match?</div><br />
                <Row className="justify-content-center">
                    <Col md="8">
                        <DifficultyCard difficulty={props.difficulty} />
                    </Col>
                </Row><br />
                <Row className="justify-content-center">
                    {finding || <FontAwesomeIcon icon={faUserFriends} size="4x" className="match-icon" />}
                    {finding && <Spinner animation="border" />}
                </Row><br />
                <div className="text-center">
                    {finding || <Button variant="dark" onClick={() => handleFindMatch()}>Find Match</Button>}
                    {finding && <Button variant="danger" onClick={() => handleCancel()}>Cancel</Button>}
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default FindMatchModal;