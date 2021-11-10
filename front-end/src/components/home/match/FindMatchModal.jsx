import React from "react";
import { useState, useContext, useRef } from "react";
import Modal from "react-bootstrap/Modal"
import DifficultyCard from "../difficulties/DifficultyCard";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../../../css/FindMatchModal.css'
import { faExclamationCircle, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Spinner } from "react-bootstrap";
import { FIND_MATCH_URL, STOP_FIND_MATCH_URL } from "../../../constants";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify'
import { AppContext } from "../../../App.js"

function FindMatchModal(props) {
    const [finding, setFinding] = useState(false);
    const history = useHistory();
    const { user, setMatch, matchRef } = useContext(AppContext);
    let cancelFunct = useRef(null);

    const callStopFind = () => {
        return axios.delete(STOP_FIND_MATCH_URL, { data: { email : user.email }}).then(res => true).catch(err => false);
    }
    
    const handleFindMatch = () => {
        setFinding(true);
        axios.post(FIND_MATCH_URL, { email: user.email, difficulty: props.difficulty},
            { cancelToken: new axios.CancelToken(c => cancelFunct.current = c) }
        ).then(response => response.data.data).then(data => {
            toast.success("Match found, practice session starting now");
            setMatch(data);
            history.push({ pathname: '/practice' });
        }).catch((error) => {
            // If request was cancelled then ignore the error.
            if (axios.isCancel(error)) {
                return;
            }
            props.setShowMatchModal(false);
            setFinding(false);
            if (error.response.status === 404) {
                toast.error(error.response.data.data.message);
            } else {
                toast.error("Error finding match, please try again later.");
            }  
        })
    }

    const handleCancel = () => {
        props.setShowMatchModal(false);
        if (!finding) {
            return;
        }

        if (cancelFunct.current !== null) {
            cancelFunct.current();
        }
        callStopFind();
        setFinding(false);
        
    }

    const inMatch = matchRef.current !== null;

    return (
        <Modal show={props.show} difficulty={props.difficulty} onHide={() => handleCancel()} className="find-match-modal" centered>
            <Modal.Body>
                <div className="find-match-modal-header">{ finding ? "Finding match" : "Find match?" }</div><br />
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
                    {!inMatch && props.enableFindMatch && (finding || <Button variant="dark" onClick={() => handleFindMatch()}>Find Match</Button>)}
                    {!inMatch && props.enableFindMatch && (finding && <Button variant="danger" onClick={() => handleCancel()}>Cancel</Button>)}
                    {inMatch && props.enableFindMatch && <p><FontAwesomeIcon icon={faExclamationCircle} /> Please end your current interview to find another match.</p>}
                    {props.enableFindMatch || "Please login to find a match."}
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default FindMatchModal;