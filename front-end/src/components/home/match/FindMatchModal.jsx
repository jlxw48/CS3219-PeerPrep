import React from "react";
import { useState, useContext } from "react";
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
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { AppContext } from "../../../App.js"

function FindMatchModal(props) {
    const [finding, setFinding] = useState(false);
    const THIRTY_SECONDS = 30 * 1000;
    const history = useHistory();
    const cancelTokenSource = axios.CancelToken.source();
    const { user, setMatch } = useContext(AppContext);
    
    const handleFindMatch = () => {
        setFinding(true);
        axios({
            method: "post",
            url: FIND_MATCH_URL,
            cancelToken = cancelTokenSource.token,
            data: {
                email: user.email,
                difficulty: props.difficulty
            }
        }).then(response => response.data.data).then(data => {
            toast.success("Match found, practice session starting now");
            setMatch(data);
            history.push({ pathname: '/practice' });
        }).catch((error) => {
            // If request was cancelled then ignore the error.
            if (axios.isCancel(error)) {
                return;
            }
            if (error.status === 404) {
                toast.error(error.response.data.data.message);
            } else {
                console.error(error);
            }
        })
    }

    const handleCancel = () => {
        setFinding(false);
        cancelTokenSource.cancel();
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
                    {finding && <Spinner animation="border"/>}
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