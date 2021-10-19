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
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify'
import authHeader from "../../../auth-header";

function FindMatchModal(props) {
    const [finding, setFinding] = useState(false);
    const THIRTY_SECONDS = 30  * 1000;
    const history = useHistory();

    const handleFindMatch = () => {
        setFinding(true);
        axios({
            method: "get",
            url: FIND_MATCH_URL,
            timeout: THIRTY_SECONDS,
            headers: authHeader(),
            data: {
                difficulty: props.difficulty
            }
        }).then(response => {
            if (response.status === 200 && response.data.status == "success") {
                toast.success("Match found, practice session starting now");
                history.push({ pathname: '/practice' });
            } else {
                toast.error("Failed to find a match, please try again.");
                handleCancel();
            }
        }).catch((error) => {
            toast.error("Failed to find a match, please try again.");
            handleCancel();
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
                    {props.enableFindMatch && (finding || <Button variant="dark" onClick={() => handleFindMatch()}>Find Match</Button>)}
                    {props.enableFindMatch && (finding && <Button variant="danger" onClick={() => handleCancel()}>Cancel</Button>)}
                    {props.enableFindMatch || "Please login to find a match."}
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default FindMatchModal;