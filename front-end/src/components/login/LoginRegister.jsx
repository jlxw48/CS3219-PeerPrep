import React, { useState, useContext, useEffect } from "react";
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import '../../css/Login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../App.js"
import Spinner from 'react-bootstrap/Spinner'
import { resHasMessage, getResMessage } from "../../Helpers.js";
import { useAppStateHelper } from "../../common/state_handlers/AppState.js";
import { REGISTER_URL, LOGIN_URL, JWT_TOKEN_NAME, VALIDATE_ADMIN_URL } from "../../constants.js"


function LoginRegister(props) {
    const history = useHistory();
    const { setUser, userRef, setIsAdmin } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const { checkIfUserInMatch } = useAppStateHelper();

    // When register form is submitted.
    const handleRegister = (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        // Show the loading spinner
        setIsLoading(true);
        axios.post(REGISTER_URL, {
            email,
            name,
            password
        }).then(res => {
            toast.success("Registration is successful, please login");
            history.push({ pathname: '/' });
        }).catch(error => {
            if (error.response && resHasMessage(error.response)) {
                toast.error(`${getResMessage(error.response)}`);
            } else {
                toast.error("Error with registration, try agian later");
            }
            setIsLoading(false);
        });
    }

    const checkIsAdmin = (token) => {
        return axios.get(VALIDATE_ADMIN_URL, {
            headers: {
                'Authorization': token
            }
        }).then(res => setIsAdmin(true)).catch(err => setIsAdmin(false));
    }

    // When login form is submitted.
    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        setIsLoading(true);
        axios.post(LOGIN_URL, {
            email,
            password
        }).then(res => res.data.data).then(data => {
            setUser(data);
            localStorage.setItem(JWT_TOKEN_NAME, data.token);
            toast.success("Login successful");
            checkIsAdmin(data.token);
            axios.defaults.headers.common['Authorization'] = data.token;
            // Checks Match microservice to see if user is in match, if so, redirect to practice page, else redirect to home.
            checkIfUserInMatch().then(hasMatch => {
                if (!hasMatch) {
                    redirectToHome();
                }
            });
        }).catch(error => {
            if (error.response && resHasMessage(error.response)) {
                toast.error(`${getResMessage(error.response)}`);
            } else {
                toast.error("Error logging in, please try again later");
            }
            setIsLoading(false);
        });
    }

    function redirectToHome() {
        history.push({ pathname: '/' });
    }

    useEffect(() => {
        if (userRef.current !== null) {
            history.push({ pathname: '/' });
            toast.success("You are already logged in, redirecting you to the homepage.");
        }
    }, [history, userRef]);

    return (
        <>
            <Container className="login-container">
                <Row className="card-row justify-content-md-center align-items-center">
                    <Col md="6">
                        <Card>
                            <Card.Header className="bg-dark text-light">{props.isRegister ? "Register" : "Login"} &nbsp;<FontAwesomeIcon icon={faLock} /></Card.Header>
                            <Card.Body>
                                <Form onSubmit={props.isRegister ? handleRegister : handleLogin}>
                                    <Row className="justify-content-md-center">
                                        <Col md="8">
                                            {props.isRegister &&
                                                <Form.Group className="mb-3" controlId="formBasicName">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control type="text" name="name" placeholder="Enter your name" />
                                                </Form.Group>
                                            }
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control type="text" name="email" placeholder="Enter email" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-md-center">
                                        <Col md="8">
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" name="password" placeholder="Password" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    {
                                        isLoading
                                            ? <Row className="justify-content-md-center"><Spinner animation="border" /></Row>
                                            : <Row>
                                                <Col md="10">
                                                    <Button variant="dark" type="submit" className="float-end">
                                                        {props.isRegister ? "Register" : "Login"}
                                                    </Button>
                                                </Col>
                                            </Row>
                                    }
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );

}

export default LoginRegister;